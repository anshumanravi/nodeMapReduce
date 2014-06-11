var config = require('./config');
var mongo = require('mongoskin');

var db = mongo.db(config.mongo.connectionString);
db.collection('maprcollection');
db.bind('maprcollection');

var localmw = {};

localmw = {

	saveJson : function(req,res,next){
		 
		 db.maprcollection.remove({},function(err,collection){
		 	
		 	var jsonInput = eval(req.body.jsonInput);

		 	for(var i=0; i<=jsonInput.length; i++){
		 		if(typeof jsonInput[i]!='undefined'){
	 				db.maprcollection.insert(jsonInput[i],function (err, doc) {
		  				if (err){
		  					console.log("error inserting: "+ err );
		  					res.send(500,'Error');
		  				} else {
		  					//console.log("inserted");
		  				}
  	 				});	
		 		}
		 		
		 	}

		 	localmw.doMapReduce(req,res,next)

		 });
	},

	doMapReduce : function(req,res,next){
		var result = [];
		var mapper = function () {
			
            var ethernet = false ;
            for(j in this.ports){
		    	if(this.ports[j].ethernet==1){
		    		ethernet = true;
		    		continue;
		    	}
		    }

			value = {
				server : this.isserver, 
			    i7 : this.type == "intel i7" ? 1 :0, 
			    withOutEthernet : ethernet ? 0 : 1,
			    maxMemory : this.memory,
			    maxCore : this.core,
			   
			}; 

			emit(1, value);
			

		};

		var bylocationtypemap = function(){
			emit({location: this.location, type: "intel i7"}, {
				count: this.type == "intel i7" ? 1 :0,
			});
		}

		var bylocationtypereduce = function(key, values){
			var count = 0;
			  values.forEach(function(v) {
			    count += v['count'];
			  });

  			return {count: count};
		}

 
		var reducer = function(key, values){
		    var a = values[0]; 
		    for(var i in values){ 
		    	var b = values[i];

			    a.server += b.server; 
			    a.i7 += b.i7;
			    a.withOutEthernet += b.withOutEthernet;
			    a.maxMemory = Math.max(a.maxMemory, b.maxMemory);
			    a.maxCore = Math.max(a.maxCore, b.maxCore);
			 } 

 			 return a;

		};

        db.maprcollection.mapReduce(
			mapper,
		    reducer, 
			{out:{ inline: 1 }}, 
			function(err, collection) {
			if (err){
  				console.log("error mapreduce: "+ err );
  				res.send(500,'Error');
			} else {
				result.push(collection);
				db.maprcollection.mapReduce(
					bylocationtypemap,
				    bylocationtypereduce, 
					{out:{ inline: 1 }}, 
					function(err, collection) {
					if (err){
		  				console.log("error mapreduce location type: "+ err );
		  				res.send(500,'Error');
					} else {
						result.push(collection);
						
						res.send('200',result);
					}
		        });
			}
        });
	},

}

module.exports = localmw;
