import React, { useEffect, useRef } from 'react';
import { StyleSheet, View } from 'react-native';

const KIT_FORM_UID = '9cf45d2196';
const KIT_FORM_SCRIPT = `https://wrnc.kit.com/${KIT_FORM_UID}/index.js`;

export function KitLaunchListForm() {
  const hostRef = useRef<View>(null);

  useEffect(() => {
    const host = hostRef.current as unknown as HTMLElement | null;
    if (
      !host ||
      typeof host.querySelector !== 'function' ||
      typeof host.appendChild !== 'function' ||
      host.querySelector(`script[data-uid="${KIT_FORM_UID}"]`)
    ) {
      return;
    }

    const script = document.createElement('script');
    script.async = true;
    script.dataset.uid = KIT_FORM_UID;
    script.src = KIT_FORM_SCRIPT;
    host.appendChild(script);

    return () => script.remove();
  }, []);

  return (
    <View
      accessibilityLabel="Join the WRNC Launch List"
      nativeID="wrnc-launch-list"
      ref={hostRef}
      style={styles.container}
    />
  );
}

const styles = StyleSheet.create({
  container: {
    alignSelf: 'center',
    marginTop: 52,
    maxWidth: 700,
    width: '100%',
  },
});
