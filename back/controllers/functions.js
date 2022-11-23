const axios = require('axios')
const result = require('../utils/result')

function getAllData(res) {
    url = "https://io.adafruit.com/api/v2/BiGTSM/feeds"
    axios.get(url ,  { headers: { 'X-AIO-Key' : 'aio_pWMh94fVWIPaJ0HQFXkfFiO40KAx' } } )
        .then((response) => {
    
           // console.log(response)

            // construction du resultat 

        result.data.temperature_bebe.value =  response.data[5].last_value
        
        result.data.temperature_interne.value = response.data[0].last_value
       
        result.data.ecg.value = response.data[1].last_value

            result.data.bpm.value = response.data[2].last_value
           
            result.data.spo2.value = response.data[3].last_value
 result.data.qualite_air.value = response.data[4].last_value
            
            res.status(200).send(result.data)

        })
        .catch((error) => {
            console.log("erreur du serveur Adafruit" + error )
            res.status(400).send(error)
        })

     

}



module.exports = {
    getAllData:getAllData,

}
