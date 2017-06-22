/**
@auto ren.shi
***/
var zk_cam_x, zk_cam_y, zk_cam_w, zk_cam_h;
var zk_camera_id_obj;

function zk_CameraTag(id) {
	var cdom = document.getElementById(id);
	zk_camera_id_obj = cdom;
	if (!cdom) return;
	zk_cam_y = parseInt(cdom.getBoundingClientRect().top); //Ԫ�ض��˵��ɼ����򶥶˵ľ���
	zk_cam_x = parseInt(cdom.getBoundingClientRect().left); //������ɼ�����߶ȡ�
	zk_cam_w = parseInt(cdom.getBoundingClientRect().width); //Ԫ�ض��˵��ɼ����򶥶˵ľ���
	zk_cam_h = parseInt(cdom.getBoundingClientRect().height);

	this.open = function() {
		return window.zk_Camera(zk_cam_x, zk_cam_y, zk_cam_w, zk_cam_h);
	}
	this.capture = function() {
		var path = window.zk_CameraCap();
		var image = "data:image/jpg;base64," + zk_ReadFile(path);
		cdom.innerHTML = ("<img id='zk_cam_capture' width='100%' height='100%' src='" + image + "'/>");
		window.zk_releaseCamera();
		return image;
	}
	this.close = function() {
		return window.zk_releaseCamera();
	}
	zk_redraw();
}

function zk_move(cx, cy, cw, ch) {
	zk_cam_x = parseInt(cx);
	zk_cam_y = parseInt(cy);
	zk_cam_w = parseInt(cw);
	zk_cam_h = parseInt(ch);
	return window.zk_moveCamera(zk_cam_x, zk_cam_y, zk_cam_w, zk_cam_h);
}
/**
�ػ�
**/
function zk_redraw() {
	var cy = zk_camera_id_obj.getBoundingClientRect().top + 30; //Ԫ�ض��˵��ɼ����򶥶˵ľ���
	var cx = zk_camera_id_obj.getBoundingClientRect().left + 280; //������ɼ�����߶ȡ�
	var cwidth = zk_camera_id_obj.getBoundingClientRect().width; //Ԫ�ض��˵��ɼ����򶥶˵ľ���
	var cheight = zk_camera_id_obj.getBoundingClientRect().height;
	if (cx < 0) {
		cwidth += cx;
		cx = 0;
	}
	if (cy < 0) {
		cheight += cy;
		cy = 0;
	}
	if (zk_cam_x != cx || zk_cam_y != cy || zk_cam_w != cwidth || zk_cam_h != cheight) {
		zk_move(cx, cy, cwidth, cheight);
	}
	setTimeout("zk_redraw()", 50);
}