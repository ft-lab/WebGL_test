/**
 * Oculus Quest hand controller control.
 * necessary :
 *    three.js
 *    GLTFLoader.js
 */

var OculusQuestHandController = {};
OculusQuestHandController.name = "Oculus Quest hand controller";

/**
 * Buttons ID.
 */
OculusQuestHandController.ButtonMapping = {
	thumbStick : 0,			// With joystick.
	trigger    : 1,
	grip       : 2,
	button1    : 3,
	button2    : 4,
	menuButton : 5 			// Can't get the menu button?
};

OculusQuestHandController.HandController = function (_scene, _renderer) {
	var scope = this;

	this.scene = _scene;
	this.renderer = _renderer;
	this.leftID = -1;					// Left controller ID (0 or 1).
	this.rightID = -1;					// Right controller ID (0 or 1).

	this.leftGamepadData = null;		// Left gamepad data.
	this.rightGamepadData = null;		// Right gamepad data.

	this.leftController = null;			// Left controller object.
	this.rightController = null;		// Right controller object.

	this.leftControllerMesh = null;		// Left controller mesh.
	this.rightControllerMesh = null;	// Right controller mesh.

	var m_glTFURL = "objects/OculusQuest_HandController.glb";	// glTF file name.

	/**
	 * Load glTF Object.
	 */
	function loadGLTF (url) {
		var loader = new THREE.GLTFLoader();
		loader.load(url, function ( gltf ) {
			// For center adjustment.
			var shiftX = 0.011;
			var shiftY = -0.01;
			var shiftZ = 0.02;

			gltf.scene.traverse( function(node) {
				if (node.name == 'left') {
					scope.leftControllerMesh = node.clone();
					scope.leftControllerMesh.position.set(-shiftX, shiftY, shiftZ);
				}
				if (node.name == 'right') {
					scope.rightControllerMesh = node.clone();
					scope.rightControllerMesh.position.set(shiftX, shiftY, shiftZ);
				}
			} );

			gltf.scene.dispose();
		} );
	}

	/**
	 * Get gamepad data.
	 * @param[in]  id   0 or 1.
	 * @param[out] gamepadData
	 *              'id'      : Identification name.
	 *             	'hand'    : '',  // left or right.
	 *				'buttons' : [0.0, 0.0, 0.0, 0.0, 0.0, 0.0],   // buttons value.
	 *				'buttonsTouched' : [false, false, false, false, false, false],   // buttons touched value.
	 *				'axes'    : [0.0, 0.0]	// Stick Axes.
	 */
	function findGamepad (id, gamepadData) {
		var retF = false;
		gamepadData.hand = '';
		var gamepads = navigator.getGamepads && navigator.getGamepads();
		for (var i = 0; i < gamepads.length; ++i) {
			var gamepad = gamepads[i];
			if (gamepad && id == i) {
				if (gamepad.id) {
					gamepadData.id = gamepad.id;
				}
				if (gamepad.hand) {		// 'left' or 'right'.
					var handStr = gamepad.hand.toLowerCase();
					if (handStr == 'left' || handStr == 'right') {
						gamepadData.hand = handStr;
					}
				}
				if (gamepad.hand == '') {
					var idStr = gamepad.id;
					if (idStr.toLowerCase().indexOf('left') >= 0) {
						gamepadData.hand = 'left';
					} else if (idStr.toLowerCase().indexOf('right') >= 0) {
						gamepadData.hand = 'right';
					}
				}

				if (gamepad.buttons) {
					gamepadData.buttons = [];
					gamepadData.buttonsTouched = [];
					for (var j = 0; j < gamepad.buttons.length; ++j) {
						gamepadData.buttons.push(gamepad.buttons[j].value);
						if (gamepad.buttons[j].touched != undefined) {
							gamepadData.buttonsTouched.push(gamepad.buttons[j].touched);
						}
					}
				}
				if (gamepad.axes) {
					gamepadData.axes = [];
					for (var j = 0; j < gamepad.axes.length; ++j) {
						gamepadData.axes.push(gamepad.axes[j]);
					}
				}
				retF = true;
				break;
			}
		}
		return retF;
	}

	/**
	 * Gamepad data.
	 */
	function initGamepadData () {
		var gamepadData = {
			'id' : '',
			'hand' : '',
			'buttons' : [0.0, 0.0, 0.0, 0.0, 0.0, 0.0],
			'buttonsTouched' : [false, false, false, false, false, false],
			'axes' : [0.0, 0.0]
		};
		return gamepadData;
	}

	/**
	 * Object existence check.
	 */
	function hasObject (_srcObject, _object) {
		if (!_srcObject || !_object) return false;
		
		var hasObjectF = false;
		var nodes = _srcObject.children;
		if (!nodes) return false;
		for (var i = 0; i < nodes.length; ++i) {
			if (nodes[i].id == _object.id) {
				hasObjectF = true;
				break;
			}
		}
		return hasObjectF;
	}

	/**
	 * Update gamepad buttons (MorphTargets).
	 */
	function updateButtons () {
		if (!scope.leftControllerMesh || !scope.rightControllerMesh) return;
		if (!scope.leftGamepadData || !scope.rightGamepadData) return;

		scope.leftControllerMesh.traverse( function(node) {
			if (node.name == 'left_buttons') {
				var gamepadData = scope.leftGamepadData;
				if (gamepadData.buttons && gamepadData.buttons.length >= 6) {
					node.morphTargetInfluences[0] = gamepadData.buttons[0];
					node.morphTargetInfluences[5] = gamepadData.buttons[1];
					node.morphTargetInfluences[6] = gamepadData.buttons[2];
					node.morphTargetInfluences[7] = gamepadData.buttons[3];
					node.morphTargetInfluences[8] = gamepadData.buttons[4];
					node.morphTargetInfluences[9] = gamepadData.buttons[5];

					if (gamepadData.axes && gamepadData.axes.length >= 2) {
						{
							var axes = gamepadData.axes[0];
							node.morphTargetInfluences[3] = (axes < 0.0) ? -axes : 0.0;
							node.morphTargetInfluences[4] = (axes > 0.0) ?  axes : 0.0;
						}
						{
							var axes = gamepadData.axes[1];
							node.morphTargetInfluences[1] = (axes < 0.0) ? -axes : 0.0;
							node.morphTargetInfluences[2] = (axes > 0.0) ?  axes : 0.0;
						}
					}
				}
			}
		});

		scope.rightControllerMesh.traverse( function(node) {
			if (node.name == 'right_buttons') {
				var gamepadData = scope.rightGamepadData;
				if (gamepadData.buttons && gamepadData.buttons.length >= 6) {
					node.morphTargetInfluences[0] = gamepadData.buttons[0];
					node.morphTargetInfluences[5] = gamepadData.buttons[1];
					node.morphTargetInfluences[6] = gamepadData.buttons[2];
					node.morphTargetInfluences[7] = gamepadData.buttons[3];
					node.morphTargetInfluences[8] = gamepadData.buttons[4];
					node.morphTargetInfluences[9] = gamepadData.buttons[5];

					if (gamepadData.axes && gamepadData.axes.length >= 2) {
						{
							var axes = gamepadData.axes[0];
							node.morphTargetInfluences[3] = (axes < 0.0) ? -axes : 0.0;
							node.morphTargetInfluences[4] = (axes > 0.0) ?  axes : 0.0;
						}
						{
							var axes = gamepadData.axes[1];
							node.morphTargetInfluences[1] = (axes < 0.0) ? -axes : 0.0;
							node.morphTargetInfluences[2] = (axes > 0.0) ?  axes : 0.0;
						}
					}
				}
			}
		});
	}

	/**
	 * Initialize.
	 */
	this.init = function () {
		// Load hand controller mesh.
		loadGLTF(m_glTFURL);
	};

	/**
	 * Update controller data.
	 */
	this.update = function () {
		if (!scope.leftControllerMesh || !scope.rightControllerMesh) return false;

		var prevLeftID  = scope.leftID;
		var prevRightID = scope.rightID;
		scope.leftID  = -1;
		scope.rightID = -1;
		
		// Get gamepad data.
		{
			var gamepadData = initGamepadData();
			if (findGamepad(0, gamepadData)) {
				if (gamepadData.hand == 'left') {
					scope.leftID = 0;
					scope.leftGamepadData = gamepadData;
				} else if (gamepadData.hand == 'right') {
					scope.rightID = 0;
					scope.rightGamepadData = gamepadData;
				}
			}
		}
		{
			var gamepadData = initGamepadData();
			if (findGamepad(1, gamepadData)) {
				if (gamepadData.hand == 'left') {
					scope.leftID = 1;
					scope.leftGamepadData = gamepadData;
				} else if (gamepadData.hand == 'right') {
					scope.rightID = 1;
					scope.rightGamepadData = gamepadData;
				}
			}
		}
		var retF = (scope.leftID >= 0) && (scope.rightID >= 0);
		if (!retF) return retF;

		// If the controller is swapping.
		if (scope.leftController && scope.rightController && (scope.leftID == prevRightID && scope.rightID == prevLeftID)) {
			var leftV = scope.leftController;
			var rightV = scope.rightController;
			scope.leftController = rightV;
			scope.rightController = leftV;
		}

		// Create controller.
		if (!scope.leftController || !scope.rightController) {
			scope.leftController = scope.renderer.vr.getController( scope.leftID );
			scope.leftController.add(scope.leftControllerMesh);
			scope.scene.add(scope.leftController);

			scope.rightController = scope.renderer.vr.getController( scope.rightID );
			scope.rightController.add(scope.rightControllerMesh);
			scope.scene.add(scope.rightController);
		}

		// Update buttons.
		updateButtons();

		return retF;
	};

	this.getLeftID = function () {
		return scope.leftID;
	};
	this.getRightID = function () {
		return scope.rightID;
	};

	this.getLeftGamepadData = function () {
		return scope.leftGamepadData;
	};
	this.getRightGamepadData = function () {
		return scope.rightGamepadData;
	};

	this.getLeftController = function () {
		return scope.leftController;
	}
	this.getRightController = function () {
		return scope.rightController;
	}

	/**
	 * Add object to left controller.
	 */
	this.addToLeftController = function (_object) {
		if (!scope.leftController) return;

		if (hasObject(scope.leftController, _object)) return;
		scope.leftController.add(_object);
	}

	/**
	 * Remove object to left controller.
	 */
	this.removeToLeftController = function (_object) {
		if (!scope.leftController) return;

		if (!hasObject(scope.leftController, _object)) return;
		scope.leftController.remove(_object);
	}

	/**
	 * Add object to right controller.
	 */
	this.addToRightController = function (_object) {
		if (!scope.rightController) return;

		if (hasObject(scope.rightController, _object)) return;
		scope.rightController.add(_object);
	}

	/**
	 * Remove object to right controller.
	 */
	this.removeToRightController = function (_object) {
		if (!scope.rightController) return;

		if (!hasObject(scope.rightController, _object)) return;
		scope.rightController.remove(_object);
	}

	/**
	 * Dump controller data.
	 * @param[in] handLeft    left : true, right: false
	 */
	this.dumpData = function (handLeft) {
		var str = '';
		var gamepadData = handLeft ? scope.leftGamepadData : scope.rightGamepadData;
		if (gamepadData == null) return '';

		{
			var controller = handLeft ? scope.leftController : scope.rightController;
			var p = controller.position;
			str += 'position : ' + (p.x).toFixed(3) + ', ' +  (p.y).toFixed(3) + ', ' + (p.z).toFixed(3) + '\n';
			
			p = controller.rotation;
			str += 'rotation(degree) : ' + (p.x * 180.0 / Math.PI).toFixed(3) + ', ' +  (p.y * 180.0 / Math.PI).toFixed(3) + ', ' + (p.z * 180.0 / Math.PI).toFixed(3) + '\n';
			str += '\n';
		}

		str += 'id : ' + gamepadData.id + '\n';
		if (gamepadData.hand) {
			str += 'hand : ' + gamepadData.hand + '\n';
		}
		if (gamepadData.buttons && gamepadData.buttons.length > 0) {
			str += 'buttons\n';
			for (var j = 0; j < gamepadData.buttons.length; ++j) {
				str += '  [' + j.toString() + '] value : ' + gamepadData.buttons[j].toFixed(2);
				if (gamepadData.buttonsTouched) {
					str += ' touched : ' + gamepadData.buttonsTouched[j];
				}
				str += '\n';
			}
		}
		if (gamepadData.axes) {
			str += 'axes [ ';
			for (var j = 0; j < gamepadData.axes.length; ++j) {
				str += gamepadData.axes[j].toFixed(4);
				if (j + 1 < gamepadData.axes.length) str += ',';
				str += ' '; 
			}
			str += ']\n';
		}
		return str;
	};

}

