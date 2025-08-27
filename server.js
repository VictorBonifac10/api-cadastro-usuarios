
//CADASTRO DE USUÁRIOS
//ENDEREÇO BASE DO SERVIDOR: http://localhost:3333

//EXPRESS & PRISMA
const express = require("express")
const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient()

const app = express()

app.use(express.json())

//------------------------------------------------------------------
//ROTA POST (CRIA UM NOVO USUÁRIO)
//------------------------------------------------------------------

app.post('/usuarios', async (req, res) => { // URL: http://localhost:3333/usuarios

    const { name, email, telefone } = req.body

    const user = await prisma.patients.create({
        data: {
            name,
            email,
            telefone
        }
    })

    return res.status(200).send(user)
})

//------------------------------------------------------------------
//ROTA GET (LISTA TODOS OS USUÁRIOS)
//------------------------------------------------------------------

app.get('/usuarios', async (req, res) => { // URL: http://localhost:3333/usuarios

    const users = await prisma.patients.findMany()

    return res.status(200).json(users)
})

//------------------------------------------------------------------
//ROTA GET (BUSCA UM USUÁRIO ATRAVÉS DO ID)
//------------------------------------------------------------------

app.get('/buscar/usuario/:id', async (req, res) => { // URL: http://localhost:3333/buscar/usuario/:id

    const id = req.params.id

    const users = await prisma.patients.findUnique({
        where: { id }
    })

    return res.status(200).json(users)

})

//------------------------------------------------------------------
//ROTA PUT (ATUALIZA OS DADOS DE UM USUÁRIO)
//------------------------------------------------------------------

app.put('/usuarios/:id', async (req, res) => { // URL: http://localhost:3333/usuarios/:id

    const id = req.params.id
    const { name, email, telefone } = req.body

    const usersUpdate = await prisma.patients.update({
        where: { id },
        data: {
            name,
            email,
            telefone
        }
    })

    return res.status(200).send(usersUpdate)

});

//------------------------------------------------------------------
//ROTA DELETE (REMOVE UM USUÁRIO)
//------------------------------------------------------------------

app.delete('/usuarios/:id', async (req, res) => { // URL: http://localhost:3333/usuarios/:id
    const id = req.params.id

    const userDeleted = await prisma.patients.delete({
        where: { id }
    })

    return res.status(200).send({ mensagem: "Usuário Deletado com sucesso!", userDeleted });

});

//------------------------------------------------------------------
//INICIALIZA O SERVIDOR
//------------------------------------------------------------------
app.listen(3333, () => {
    console.log("Servidor rodando!")
})
