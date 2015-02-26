
module.exports = 
	cleanUrl: (url) ->
			url.indexOf('http') is 0 
				url
			else if url.indexOf('/assets')
				# todo include local folder if not deployed in domain root
				url
			else 
				# Assume it's local and we need to add the /assets/
				'/assets/' + url
