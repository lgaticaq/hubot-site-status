// Description
//   Chequea sitios caidos y avisa en tiempo real
//
// Configuration:
//   HUBOT_SITES_CHANNEL - Canal para notificar
//
// Commands:
//   hubot sites add - <Agrega un sitio a la lista>
//   hubot sites delete - <Elimina un sitio de la lista>
//   hubot sites all - <Lista los sitios que se están chequeando>
//
// Notes:
//   Es necesario tener redis-brain
//
// Author:
//   Fabian General[fabianwgl@protonmail.com]

const request = require('request')

module.exports = robot => {
  let downSites = robot.brain.get('downSites') ? robot.brain.get('sites') : []

  robot.respond(/sites add (.*)/i, res => {
    let site = res.match[1]
    let sites = robot.brain.get('sites')

    if(!sites)
      sites = []
    sites.push(site)
    if(robot.brain.set('sites',sites))
      res.send(`Sitio agregado ${site}`)
    else
      res.send(`Error agregando ${site}`)
  })

  robot.respond(/sites delete (.*)/i, res => {
    let site = res.match[1]
    let sites = robot.brain.get('sites')

    let numb = sites.indexOf(site)
    if(numb > -1){
      sites.splice(numb,1)
      if(robot.brain.set('sites',sites))
        res.send(`Sitio eliminado ${site}`)
      else
        res.send(`Error eliminando ${site}`)
    }else{
      res.send(`No se encontró ${sites} en la lista`)
    }
  })

  robot.respond(/sites all/i, res => {
    let sites = robot.brain.get('sites')
    let response = ""
    sites.map(x=>{
      response+=`${x}\n`
    })
    res.send(response)
  })

  setInterval(() => {
    let sites = robot.brain.get('sites')
    if(sites){
      sites.map( x => {
        request(x, (error, response, body) => {
          if(error)
            throw error
          //console.log(`statusCode for ${x} :`, response && response.statusCode)
          //Cubrir errores del cliente y servidor
          const channel = process.env.HUBOT_SITES_CHANNEL || 'general'
          if(response.statusCode>=400 && response.statusCode<=512){
            if(downSites.indexOf(x) == -1){
              downSites.push(x)
              robot.brain.set('downSites',downSites)
              robot.messageRoom(channel,`¡Hey! se cayó ${x}`)
            }
          }
          if(response.statusCode<=308){
            if(downSites.indexOf(x) > -1){
              let numb = downSites.indexOf(x)
              downSites.splice(numb,1)
              robot.brain.set('downSites',downSites)
              robot.messageRoom(channel,`¡Hey! Ya volvió ${x}`)
            }
          }
        });
      })
    }else{
      //no hay sitios
    }
  },5000)
}
