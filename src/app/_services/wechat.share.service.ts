import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

declare let wx: any;
declare var require: any;

var sha1 = require('sha1');

@Injectable()
export class WechatShareService {
    constructor(private http: HttpClient) { }

    // 后台获取signature
    public getWXSignature(date: String, nonce: String): any {
        var signatureString = 'jsapi_ticket=' + this.getJsapiTicket();
        signatureString = signatureString + '&noncestr='+nonce;
        signatureString = signatureString + '&timestamp='+date;
        signatureString = signatureString + '&url=http://127.0.0.1/';

        console.log ('The string for singature: ' + signatureString);
        
        const signature = sha1(signatureString);

        console.log ('The singature: ' + signature);

    }

    // 根据后台获取的数据注册config
    public configWXJs() {
        var date = Date.now() / 1000 + '';
        var nonce = Date.now() + '';
        wx.config({
            debug: false,
            appId: "wxfa89ba9c147f198f",
            timestamp: date,
            nonceStr: nonce,
            signature: this.getWXSignature(date, nonce),
            jsApiList: ['updateAppMessageShareData', 'updateTimelineShareData']
        });
    }
    // 对分享信息进行处理，并注册分享函数
    public getShareDataAndReady(title, imgUrl, desc, slug) {

        let shareTitle = title ? title : '自定义title';
        let shareImg = imgUrl ? imgUrl : "默认图片";
        let shareDesc = desc ? desc : '默认描述';
        let link = location.href;

        this.configWXJs();

        wx.ready(function () {
            wx.updateAppMessageShareData({ title: shareTitle, desc: shareDesc, link: link , imgUrl: shareImg, sucess: function() {} });  // 分享微信
            wx.updateTimelineShareData({ title: shareTitle, desc: shareDesc, link: link , imgUrl: shareImg, sucess: function() {}});    // 分享到朋友圈
        });
  }

  private shareIsReady(target: string) {
      console.log ("ready to share to " + target);
  }

  private getJsapiTicket() {
    var expireDate = localStorage.getItem('js_api_token_expireDate');
      
    if (expireDate == null || (Date.now() - parseInt(expireDate) <= 0) ) {
        const access_token_data = this.http.get('https://api.weixin.qq.com/cgi-bin/token?grant_type=client_credential&appid=wxfa89ba9c147f198f&secret=eb0de94f65b35818b22313aa8b1b0877').toPromise();
        const access_token = access_token_data['access_token'];
        console.log('access_token = ' + access_token);

        const jsapi_ticket_data = this.http.get('https://api.weixin.qq.com/cgi-bin/ticket/getticket?access_token='+access_token+'&type=jsapi').toPromise();
        console.log('access_token = ' + jsapi_ticket_data['ticket']);

        localStorage.setItem('jsapi_ticket', jsapi_ticket_data['ticket']);
        localStorage.setItem('jsapi_ticket_expireDate', Date.now() + 7200000 +'');
        
    }
      return localStorage.getItem('jsapi_ticket');
  }

  public doShare(title, imgUrl, desc, slug) {
    
    //this.siteConfig = await this.http.getSiteConfig();

    this.configWXJs();

    this.getShareDataAndReady(title, imgUrl, desc, slug);
  }
  
}


