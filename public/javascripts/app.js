var app = {
        
        init : function(opt){
        	app.options = opt;
        	app.bindClick();
        },


		sendAjaxPost:function(){
			
			if(app.options.processing) return;

			var data = app.getJsonData();
			var url = app.options.url;

			app.options.processing = true;

			jQuery.ajax({
				  type: "POST",
				  url: url,
				  data: data,
				  success: function(msg){
				       app.options.callback(msg)
				  },
				  error: function(XMLHttpRequest, textStatus, errorThrown) {
				     console.log(textStatus+"____"+errorThrown);
				  },
				  complete: function(){
				  	app.options.processing = false;
				  }
			});

		},

		bindClick: function(){

			var btnid = app.options.btnid;

			jQuery(btnid).unbind();

			jQuery(btnid).bind('click',function(){
				app.sendAjaxPost();
			});
		},

		getJsonData: function(){
			return {"jsonInput" : jQuery(app.options.txtAreaId).val() };
		},
};






app.init({
	"txtAreaId" : "#jsonInput",
	"processing" : false,
	"btnid" : "#sendJson",
	"url" : "../processJson",
	 callback : function(msg){
	 	//displays mapr result here
	 	jQuery("#result").html(JSON.stringify(msg));
	 	console.log("completed")
	 }

});


