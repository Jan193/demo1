import storage from './storage';
export const connectWS = () => {
  return new Promise((resolve, reject) => {
    const ws = new WebSocket('ws://yist.bfwit.net/ws/app');
    ws.onopen = () => {
      // this.props.saveWS(ws);
      resolve(ws);
      storage.load({key: 'userInfo'}).then(async res => {
        this.setState({loading: false});
        if (res && res.token) {
          setInterval(() => {
            ws.send(
              JSON.stringify({
                token: res.token,
                cmd: 'heart',
              }),
            );
          }, 2000);
        }
      });
    };
    ws.onclose = () => {
      console.log('关闭了');
      reject(ws);
    };
  });
  // ws.onmessage = e => {
  //   console.log('接收消息:', e);
  // };
  // ws.onerror = e => {
  //   console.log('错误:', e);
  // };
};
