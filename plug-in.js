/* 
* tableUI 1.0 
* liuqing 
* Date: 2016-03-01 
* table奇偶行颜色交替，鼠标移入高亮显示 
*/ 
(function($){
     $.fn.tableUI = function(options){
	     var opts = $.extend({}, $.fn.tableUI.defaults, options);

		 return this.each(function(){
		     var table = $(this);
			 table.find("tr:even").addClass(opts.evenRowClass);
			 table.find("tr:odd").addClass(opts.oddRowClass);
			 table.find("tr").hover(function(){
			      $(this).addClass(opts.activeRowClass);
			 },function(){
			      $(this).removeClass(opts.activeRowClass);
			 });
		 });
	 }

	 $.fn.tableUI.defaults = {
	     evenRowClass : "evenRow",
		 oddRowClass : "oddRow",
		 activeRowClass: "activeRow"
	 }
})(jQuery);

/* 
* hilight 1.0 
* liuqing 
* Date: 2016-03-01 
* 使文本高亮显示
*/ 
(function($){
    $.fn.hilight = function(options){
		debug(this);

	    var opts = $.extend({}, $.fn.hilight.defaults, options);

		return this.each(function(){
		    var $this = $(this);
			var o = $.metadata? $.extend({}, opts, $this.metadata()) : opts;
            $this.css({
			    color: o.foreground,
				background: o.background
			});
			
			var txt = $this.html();
			txt = $.fn.hilight.format(txt);
			$this.html(txt);
		});
	}

	// 私有函数：debugging    
	function debug($obj){
	    if(window.console && window.console.log){
		    window.console.log("hilight selection count: " + $obj.size());
		}
	}

    // 定义暴露format函数    
	$.fn.hilight.format = function(txt){
	    return "<strong>" + txt + "</strong>";
	};

	$.fn.hilight.defaults = {
	    foreground: "red",
	    background: "yellow"
	};
})(jQuery);

/* 
* message 1.0 
* liuqing 
* Date: 2016-03-03 
* 提示框
*/ 
;(function($){
	function createMsg(title, content, buttons){
	     var message = $("<div class='message'></div>").appendTo("body");
		 message.append("<div class='msg-tip clearfix'><div class='tip-title'>" + title + "</div><div class='tip-close'>X</div></div>" + content);
		 var buttonWrap = $("<div class='msg-table'><div class='msg-tr'></div></div>").appendTo(message);
		 if(buttons){
			 var flag = true;
		     for(var label in buttons){
			     if(label == "sure"){
					 $("<a class='sure' href='#'>确定</a>").bind("click", buttons[label]).appendTo(buttonWrap.find(".msg-tr"));
				 }else{
				     $("<a class='sure' href='#'>取消</a>").bind("click", buttons[label]).appendTo(buttonWrap.find(".msg-tr"));
					 flag = false;
				 }
			 }
             message.find("a").wrap("<div class='msg-td'></div>");

			 if(flag){
			     message.find(".sure").addClass("nb");
			 }
		 }
		 
		 message.find(".tip-close").bind("click", function(){
		     close(message);
		 });

         return message;
	}

	function close(message){
		message.data("message").mask.remove();
	    message.remove();
	}

    $.message = {
	    alert: function(title, content){
			 var winHeight = $(window).height(),
				 winWidth = $(window).width(),
			     content = "<div class='msg-content'>"+ content +"</div>",
				 buttons = {};

			 buttons["sure"] = function(){
				  close(message);
			 };
                  
			 var message = createMsg(title, content, buttons);

			 message.data("message", {});

			 message.css({
			     "left": (winWidth - message.width()) / 2,
				 "top": (winHeight - message.height()) / 2
			 });
		     
			 message.data("message").mask = $("<div class='msg-mask'></div>").appendTo($(document.body));
		},
	    confirm: function(title, content, fn){
		     var winHeight = $(window).height(),
				 winWidth = $(window).width(),
			     content = "<div class='msg-content'>"+ content +"</div>",
				 buttons = {};

			 buttons["sure"] = function(){
				  close(message);
				  if(fn){
					  fn(true);
					  return false;
				  } 
			 };

		     buttons["cancel"] = function(){
			      close(message);
                  if(fn){
				      fn(false);
					  return false;
				  }
			 };
    
			 var message = createMsg(title, content, buttons);

			 message.data("message", {});

			 message.css({
			     "left": (winWidth - message.width()) / 2,
				 "top": (winHeight - message.height()) / 2
			 });
			 
			 message.data("message").mask = $("<div class='msg-mask'></div>").appendTo($(document.body));

		}
	}

})(jQuery);

/* 
* dialog 1.0 
* liuqing 
* Date: 2016-03-03 
* 对话框
*/ 
;(function($){
	function createDlg(obj, title){
		 obj.children().wrapAll("<div class='dlg-content'></div>");
		 obj.prepend("<div class='dlg-tip clearfix'><div class='dlg-tip-title'>" + title + "</div><div class='dlg-tip-close'>X</div></div>");
		 
		 obj.find(".dlg-tip-close").bind("click", function(){
		     $.fn.dialog.close(obj);
		 });

         return obj;
	}

    $.fn.dialog = function(options){
		 if (typeof options == 'string'){
			if(options == "close"){
				$.fn.dialog.close(this);
				return;
			}
		 }

		 var winHeight = $(window).height(),
			 winWidth = $(window).width(),
			 buttons = {},
			 $this = $(this),
			 opts = $.extend({}, $.fn.dialog.defaults, options || {});
			  
		 var dialog = createDlg($this, opts.title);

		 dialog.data("dialog", {});

		 dialog.css("width", opts.width);
		 dialog.css({
			 "left": (winWidth - dialog.width()) / 2,
			 "top": (winHeight - dialog.height()) / 2
		 });
		 
		 dialog.data("dialog").mask = $("<div class='dlg-mask'></div>").appendTo($(document.body));
	}

	$.fn.dialog.close = function(dialog){
	    dialog.empty();
        dialog.data("dialog").mask.remove();
	}

    $.fn.dialog.defaults = {
	    title: '对话框',
		width: 500
	};
})(jQuery);

/* 
* myPlugin 1.0 
* liuqing 
* Date: 2016-03-04 
* 美化页面
*/ 
;(function($, window, document,undefined) {
  //定义Beautifier的构造函数
  var Beautifier = function(ele, opt) {
    this.$element = ele,
    this.defaults = {
      'color': 'red',
      'fontSize': '12px',
      'textDecoration': 'none'
    },
    this.options = $.extend({}, this.defaults, opt)
  }
  //定义Beautifier的方法
  Beautifier.prototype = {
    beautify: function() {
      return this.$element.css({
        'color': this.options.color,
        'fontSize': this.options.fontSize,
        'textDecoration': this.options.textDecoration
      });
    }
  }
  //在插件中使用Beautifier对象
  $.fn.myPlugin = function(options) {
    //创建Beautifier的实体
    var beautifier = new Beautifier(this, options);
    //调用其方法
    return beautifier.beautify();
  }
})(jQuery, window, document);