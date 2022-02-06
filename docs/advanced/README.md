## 如何调试

由于目前Apple的安全限制，暂无法使用相关调试工具进行断点调试，现阶段您可以使用如`alert`、`showHUD`等方法在屏幕上输出您需要的调试信息。

## QuartzCore

IOS设备给用户的视觉反馈都是基于QuartzCore框架来进行的，利用该框架可以实现一些美观的动画效果，如果您的插件中需要进行UI渲染等，可以自行学习QuartzCore框架

## UIKit

> 以下内容摘自[Apple开发者文档](https://developer.apple.com/cn/documentation/uikit/)，如果您有兴趣可以前往阅读

UIKit 框架提供了 iOS 或 Apple tvOS app 所需的基础架构。它提供了用于实施界面的窗口和视图架构，用于向 app 提供多点触控和其他类型输入的事件处理基础架构，以及管理用户、系统和 app 之间互动所需的主运行循环。该框架提供的其他功能包括动画支持、文档支持、绘图和打印支持、当前设备的相关信息、文本管理和显示、搜索支持、辅助功能支持、app 扩展支持和资源管理。

## 申请官方签名

### 申请渠道

请按照规范格式，发送邮件至 [service@marginnote.com](mailto:service@marginnote.com) ，技术人员会在72小时内完成审核并予以答复。

> 邮件标题：插件签名申请-插件名-论坛ID
>
> 范例：插件签名申请-MDXdict-Petter1925
>
> 邮件正文：
> 1，插件功能描述
> 2，技术说明
>
> 邮件附件：以未签名格式打包的mnaddon文件，用于功能测试

请注意，不规范的邮件格式可能无法被客服系统正确识别。

### 插件签名的权限和功能

#### 即时向用户推送更新

未经认证的插件更新需要用户自行下载覆盖安装新版本，不利于及时修复bug。官方认证后，可通过MN服务器在线向终端用户推送插件升级服务，方便用户及时升级到最新版本。

*说明*：后续更新需要重新按上述流程申请签名，但申请同时我们可以提供代为推送更新的服务。（基于新旧签名识别已安装用户，icloud Kit推送）

#### 免去额外设置

未经认证的插件需要用户额外设置开启“允许加载未经认证的插件”，官方认证后可免除设置并直接安装。

#### 关闭弹窗警告

未经认证的插件会在用户使用MN时会弹出警示窗口，官方认证后，使用插件则不会弹窗。



# 其他

## 常见问题

## AutoTitle 剖析

您或许已经了解了上述的API内容，但对于如何组织一个专属于您的插件还感到些许迷茫，我们为您提供的`AutoTitle`插件中的`main.js`的详细注释版本，需要您结合之前所掌握的内容，来认真阅读与思考，相信您很快就可以上手制作属于自己的插件了。

当然，纸上谈兵是远远不够的，我们非常希望您可以即刻行动，将您的想法付诸实践，这样您才能正常理解本文提到的所有概念。当然，若您发现文本存在错误，或您有更好的想法，欢迎与我们进行交流！

```js
JSB.newAddon = function(mainPath){//这是JSBridge的方法，您不需要关心这里
    var newAddonClass = JSB.defineClass('AutoTitle : JSExtension', /*Instance members*/{
      //Window initialize
      sceneWillConnect: function() {//这里便是之前提到的生命周期函数了，您在sceneWillConnect下所编写的代码，会在窗口激活时被执行
          self.webController = WebViewController.new();//这里创建了一个WebViewController的实例
      },
      //Window disconnect
      sceneDidDisconnect: function() {
      },
      //Window resign active
      sceneWillResignActive: function() {
      },
      //Window become active
      sceneDidBecomeActive: function() {
      },
      notebookWillOpen: function(notebookid) {//这里是notebookWillOpen生命周期，会在笔记本被打开时执行其中的代码
        //NSNotificationCenter是关于消息通知的一个类
        //defaultCenter()是NSNotificationCenter中的类方法，它可以返回该类的实例
        //addObserverSelectorName()是关于添加观察者的方法，显然该方法需要创建实例后调用

        NSNotificationCenter.defaultCenter().addObserverSelectorName(self,'onProcessExcerptText:','ProcessNewExcerpt');
        //当ProcessNewExcerpt发生时，即有新摘录时，触发onProcessExcerptText事件，该事件在后续需要您详细定义其操作内容
        NSNotificationCenter.defaultCenter().addObserverSelectorName(self,'onProcessExcerptText:','ChangeExcerptRange');
        //当ChangeExcerptRange发生时，即修改摘录时，触发onProcessExcerptText事件
        self.autotitle = NSUserDefaults.standardUserDefaults().objectForKey('marginnote_autotitle');
        //绑定插件
      },
      notebookWillClose: function(notebookid) {
        //这里则是当笔记本关闭时，将相关的消息通知关闭
        NSNotificationCenter.defaultCenter().removeObserverName(self,'ProcessNewExcerpt');
        NSNotificationCenter.defaultCenter().removeObserverName(self,'ChangeExcerptRange');
      },
      documentDidOpen: function(docmd5) {
      },
      documentWillClose: function(docmd5) {
      },
      controllerWillLayoutSubviews: function(controller) {
      },
      queryAddonCommandStatus: function() {
        if(Application.sharedInstance().studyController(self.window).studyMode < 3)//判断当前模式，即在只读模式下插件不生效
          return {image:'title.png',object:self,selector:'toggleAutoTitle:',checked:(self.autotitle?true:false)};
        return null;
      },
      //Clicking note
      onProcessExcerptText: function(sender){//这里便是之前触发的事件内容，其中定义了当摘录被创建或改变时需要执行的内容
        if(!Application.sharedInstance().checkNotifySenderInWindow(sender,self.window))return;//仅仅处理当前窗口的内容
        if(!self.autotitle)return;//判断插件是否生效
        var noteid = sender.userInfo.noteid;//获取笔记ID
        var note = Database.sharedInstance().getNoteById(noteid);//通过笔记ID获取笔记
        if(note && note.excerptText && note.excerptText.length > 0 && note.excerptText.length <= 250 && !note.groupNoteId){//笔记存在且摘录文本存在且摘录文本长度不为0且摘录文本长度不足250且没有成组
          var timerCount = 0;//计数器置零
          NSTimer.scheduledTimerWithTimeInterval(1,true,function(timer){
            var text = note.excerptText.split("**").join("");//将摘录文本处理后存入text变量
            if(text && text.length){
              UndoManager.sharedInstance().undoGrouping('AutoTitle',note.notebookId,function(){
                note.noteTitle = text;//将text赋值给笔记标题
                note.excerptText = '';//将笔记摘录置空
                Database.sharedInstance().setNotebookSyncDirty(note.notebookId);//同步修改至数据库
              });
              NSNotificationCenter.defaultCenter().postNotificationNameObjectUserInfo('RefreshAfterDBChange',self,{topicid:note.notebookId});
            }
            timerCount++;
            if(timerCount >= 4){
              timer.invalidate();
            }
          });
        }
      },
      toggleAutoTitle: function(sender) {//这里是插件的开关判断，如果您没有兴趣探究，可以将一下内容稍加修改，便可作为您的插件的开关选择
        var lan = NSLocale.preferredLanguages().length?NSLocale.preferredLanguages()[0].substring(0,2):'en';
        if(self.autotitle){
          self.autotitle = false;
          if(lan == 'zh')
            Application.sharedInstance().showHUD('自动设置标题已关闭',self.window,2);
          else
            Application.sharedInstance().showHUD('Auto title is turned off',self.window,2);
        }
        else{
          self.autotitle = true;
          if(lan == 'zh')
            Application.sharedInstance().showHUD('创建摘录后，摘录内容将自动被设置为笔记标题',self.window,2);
          else
            Application.sharedInstance().showHUD('After creating an excerpt, the excerpt will be automatically set as the note title',self.window,2);
        }
        NSUserDefaults.standardUserDefaults().setObjectForKey(self.autotitle,'marginnote_autotitle');
        Application.sharedInstance().studyController(self.window).refreshAddonCommands();
      },
    }, /*Class members*/{
      addonDidConnect: function() {
      },
      addonWillDisconnect: function() {
      },
      applicationWillEnterForeground: function() {
      },
      applicationDidEnterBackground: function() {
      },
      applicationDidReceiveLocalNotification: function(notify) {
      },
    });
    return newAddonClass;
  };
```

