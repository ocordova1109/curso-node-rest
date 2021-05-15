const {Router}=require('express');
const { check } = require('express-validator');
const { usuariosGet, usuariosPut, usuariosPost, usuariosDelete, usuariosPatch } = require('../controllers/usuarios');
const { esRoleValido, emailExiste, existeUsuarioporId } = require('../helpers/db-validators');
const{validarcampos}=require('../middlewares/validar-campos');


const router=Router();

router.get('/',usuariosGet);

router.put('/:id',[
    check('id','No es un ID válido').isMongoId(),
    check('id').custom(existeUsuarioporId),
    check('rol').custom(esRoleValido),
    validarcampos
],usuariosPut);

router.post('/',
[
    check('nombre','El nombre es obligatorio').not().isEmpty(),
    check('password','El password debe de ser más de 6 letras').isLength({min:6}),
    check('correo','El correo no es válido').isEmail(),
    check('correo').custom(emailExiste),
    //check('rol','No es un rol permitido').isIn(['ADMIN_ROLE','USER_ROLE']),
    check('rol').custom(esRoleValido),
    
]
,usuariosPost);

router.delete('/:id',[
    check('id','No es un ID válido').isMongoId(),
    check('id').custom(existeUsuarioporId),
    validarcampos
],
usuariosDelete);

router.patch('/',usuariosPatch);


module.exports=router;