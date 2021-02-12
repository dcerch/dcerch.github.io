$('#projectDeviceEnvironment div div div').css('opacity', '0.2');

var deviceEnvironment = {
  device_online: is.online(),
  device_offline: is.not.online(),
  device_touch: is.touchDevice(),
  device_desktop: is.desktop(),
  device_mobile: is.mobile(),
  device_tablet: is.tablet(),
  device_iphone: is.iphone(),
  device_ipad: is.ipad(),
  device_ipod: is.ipod(),
  device_ie: is.ie(),
  device_edge: is.edge(),
  device_chrome: is.chrome(),
  device_firefox: is.firefox(),
  device_opera: is.opera(),
  device_safari: is.safari(),
  device_ios: is.ios(),
  device_android: is.android(),
  device_blackberry: is.blackberry(),
  device_windowsmobile: is.windowsPhone(),
  device_windows: is.windows(),
  device_mac: is.mac(),
  device_linux: is.linux()
};

$.each(deviceEnvironment, function(key, value) {
  if(value == true) {
    $('#' + key).css('opacity', '1');
  }
});
