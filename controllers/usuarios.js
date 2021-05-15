const {response}=require('express');
const bcryptjs=require('bcryptjs');
const Usuario=require('../models/usuario');
const usuario = require('../models/usuario');


const usuariosGet=async(req=request,res=response)=>{

    const{ limite=5, desde=0 }=req.query;
    const query= {estado:true};    

    const [total,usuarios]=await Promise.all([
        Usuario.countDocuments(query),
        Usuario.find(query)
        .skip(Number(desde))
        .limit(Number(limite))
    ])
    
    res.json({
        total,
        usuarios
    });
}

const usuariosPut=async(req,res=response)=>{
    const {id}=req.params;
    const{_id,password,google,...resto}=req.body;

    //todo validar contra BD
    if(password){
        const salt=bcryptjs.genSaltSync();
        resto.password=bcryptjs.hashSync(password,salt);
    }

    const usuario=await Usuario.findByIdAndUpdate(id,resto);

    res.json(usuario);
}

const usuariosPost=async(req,res=response)=>{

    const {nombre,correo,password,rol}=req.body;
    const usuario=new Usuario({nombre,correo,password,rol});

    //Verificar si el correo existe
    

    //Encriptar la contraseña
    const salt=bcryptjs.genSaltSync(10);
    usuario.password=bcryptjs.hashSync(password,salt);

    //Guardar en BD
    await usuario.save();
    
    res.json({
        usuario
    });
}

const usuariosDelete=async(req,res=response)=>{


    const {id}=req.params;
    //borrar fisicamente

    //const usuario=await Usuario.findByIdAndDelete(id);
    const usuario=await Usuario.findByIdAndUpdate(id,{estado:false});

    res.json({
            usuario
    });
}

const usuariosPatch=(req,res=response)=>{
    res.json({
        msg:'patch API - controlador'
    });
}

module.exports={usuariosGet,usuariosPut,usuariosPost,usuariosDelete,usuariosPatch}