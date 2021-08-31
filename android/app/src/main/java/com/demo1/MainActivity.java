package com.demo1;

import com.facebook.react.ReactActivity;

import android.os.Bundle;
import android.widget.Toast;

import com.tencent.wework.api.WWAPIFactory;
import com.tencent.wework.api.IWWAPI;
import com.tencent.wework.api.model.WWAuthMessage;
import com.tencent.wework.api.IWWAPIEventHandler;
import com.tencent.wework.api.model.BaseMessage;

public class MainActivity extends ReactActivity {

  private static final String APPID = "ww7ab3aa98b16a0acb";
  private static final String AGENTID = "1000013";
  private static final String SCHEMA = "wwauth7ab3aa98b16a0acb000013";

  /**
   * Returns the name of the main component registered from JavaScript. This is used to schedule
   * rendering of the component.
   */
  @Override
  protected String getMainComponentName() {
    return "demo1";
  }

  @Override
  protected void onCreate(Bundle savedInstanceState) {
    super.onCreate(null);

    IWWAPI iwwapi = WWAPIFactory.createWWAPI(this);
    iwwapi.registerApp(SCHEMA);

    final WWAuthMessage.Req req = new WWAuthMessage.Req();
    req.sch = SCHEMA;
    req.appId = APPID;
    req.agentId = AGENTID;
    req.state = "dd";
    iwwapi.sendMessage(req, new IWWAPIEventHandler() {
        @Override
        public void handleResp(BaseMessage resp) {
            if (resp instanceof WWAuthMessage.Resp) {
                WWAuthMessage.Resp rsp = (WWAuthMessage.Resp) resp;
                if (rsp.errCode == WWAuthMessage.ERR_CANCEL) {
                Toast.makeText(MainActivity.this, "登录取消", Toast.LENGTH_SHORT).show();
                }else if (rsp.errCode == WWAuthMessage.ERR_FAIL) {
                Toast.makeText(MainActivity.this, "登录失败", Toast.LENGTH_SHORT).show();
                } else if (rsp.errCode == WWAuthMessage.ERR_OK) {
                Toast.makeText(MainActivity.this, "登录成功：" + rsp.code,
                Toast.LENGTH_SHORT).show();
                }
            }
        }
    });

  }
}
