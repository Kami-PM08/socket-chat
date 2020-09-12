const { io } = require('../server');

const { Usuarios } = require('../classes/usuarios');
const { crearMensaje } = require('../utils/utils');

const usuarios = new Usuarios();

io.on('connection', (client) => {

    client.on('entrarChat', (usuario, callback) => {

        console.log(usuario);

        if (!usuario.nombre || !usuario.sala) {
            return callback({
                error: true,
                message: 'El nombre/sala es necesario.'
            });
        }

        client.join(usuario.sala);

        usuarios.agregarPersona(client.id, usuario.nombre, usuario.sala);
        let personas = usuarios.getPersonasSala(usuario.sala);
        client.broadcast.to(usuario.sala).emit('listaPersonas', personas);
        client.broadcast.to(usuario.sala).emit('crearMensaje', crearMensaje('Admin', `${usuario.nombre} se ha unido al chat.`));

        callback(personas);
    });

    client.on('crearMensaje', (data, callback) => {
        let persona = usuarios.getPersona(client.id);
        let mensaje = crearMensaje(persona.nombre, data.mensaje);

        client.broadcast.to(persona.sala).emit('crearMensaje', mensaje);

        callback(mensaje);
    });

    client.on('mensajePrivado', (data) => {
        let persona = usuarios.getPersona(client.id);
        client.broadcast.to(data.para).emit('mensajePrivado', crearMensaje(persona.nombre, data.mensaje));
    });

    client.on('disconnect', () => {
        let borrado = usuarios.borrarPersona(client.id);

        client.broadcast.to(borrado.sala).emit('crearMensaje', crearMensaje('Admin', `${borrado.nombre} ha abandonado el chat.`));

        client.broadcast.to(borrado.sala).emit('listaPersonas', usuarios.getPersonasSala(borrado.sala));

    });
});