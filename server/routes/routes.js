const express = require('express')
const Votante = require('../models/Votante')
const router = express.Router()
router.post('/registro', (req, res)=>{
    if(req.body){
        const nuevoVotante =  new Votante(req.body)
        Votante.registro(nuevoVotante, (err, result)=>{
            if(err){
                res.status(400).send({error: err})
            }else{
                res.send({success: true})
            }
        })
    }else{
        res.status(400).send({error : "Campos invalidos"})
    }
})
module.exports = router