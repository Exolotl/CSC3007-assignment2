var crimeData ={}

fetch('https://data.gov.sg/api/action/datastore_search?resource_id=83c21090-bd19-4b54-ab6b-d999c251edcf')
    // get API response
    .then(response => response.json())
    
    // get parking data and remove unecessarry info elements
    .then(data => crimeData = data.result)
    
    // for console log debugging
    .then(test => console.log(crimeData))