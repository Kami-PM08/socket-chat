class Usuarios {

    constructor() {
        this.personas = [];
    }

    agregarPersona(id, nombre, sala) {
        let persona = {
            id,
            nombre,
            sala
        }
        this.personas.push(persona);

        return this.personas;
    }

    getPersonas() {
        return this.personas;
    }

    getPersonasSala(sala) {
        let personas = this.personas.filter((persona) => persona.sala === sala);
        return personas;
    }

    getPersona(id) {
        let persona = this.personas.filter((persona) => persona.id === id)[0];

        return persona;
    }

    borrarPersona(id) {
        let personaB = this.getPersona(id);
        this.personas = this.personas.filter((persona) => persona.id !== id);
        return personaB;
    }
}


module.exports = {
    Usuarios
}