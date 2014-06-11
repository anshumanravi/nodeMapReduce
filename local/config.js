var config = {};
config = {
			"mongo": {
				    "connectionString" : "mongodb://localhost/test",
					"host":'localhost',
					"port":'27100',
			},
			"web":{
				    "port": 3000,
				    "environment" : 'development'
			},
	        
	}

module.exports = config;
