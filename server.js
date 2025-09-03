
//CADASTRO DE USUÁRIOS
//ENDEREÇO BASE DO SERVIDOR: http://localhost:3333

//EXPRESS & PRISMA
const express = require('express')
const cors = require('cors')
const { PrismaClient } = require('@prisma/client')
const dotenv = require('dotenv')

dotenv.config()

const prisma = new PrismaClient()
const app = express()

app.use(express.json())
app.use(cors())

//------------------------------------------------------------------
// INICIALIZA O SERVIDOR
//------------------------------------------------------------------

const PORT = process.env.PORT || 5000

app.listen(PORT, async () => {
    try {
        // Faz uma query simples só para validar a conexão
        await prisma.$connect()
        console.log("✅ Conectado ao MongoDB Atlas via Prisma")
        console.log(`🚀 Server rodando na porta ${PORT}`)
    } catch (err) {
        console.error("❌ Erro ao conectar no banco:", err)
    }
})

//------------------------------------------------------------------
//ROTA GET (SERVIDOR ONLINE)
//------------------------------------------------------------------

app.get("/", (req, res) => {
    res.send("API está online ✅");
});

//------------------------------------------------------------------
//VALIDACAO CPF
//------------------------------------------------------------------

function validarCPF(cpf) {
    cpf = cpf.replace(/\D/g, '') // remove tudo que não for número
    return cpf.length === 11   // garante que tem 11 dígitos

}

//------------------------------------------------------------------
//ROTA POST (CRIA UM NOVO USUÁRIO)
//------------------------------------------------------------------

app.post('/usuarios', async (req, res) => { // URL: http://localhost:3333/usuarios

    try {
        const { cpf, name, dataNascimento, telefone, email, planoSaude } = req.body

        if (!validarCPF(cpf)) {
            return res.status(400).json({ error: "CPF inválido, deve conter 11 dígitos numéricos" })
        }

        const user = await prisma.patients.create({
            data: {
                cpf: cpf.replace(/\D/g, ''), // já salva só os números
                name,
                dataNascimento: new Date(dataNascimento),
                telefone,
                email,
                planoSaude
            }
        })

        return res.status(200).send(user)

    } catch (error) {
        res.status(500).json({ error: "Erro ao cadastrar paciente", details: error.message })
    }
})

//------------------------------------------------------------------
//ROTA GET (LISTA TODOS OS USUÁRIOS)
//------------------------------------------------------------------

app.get('/usuarios', async (req, res) => { // URL: http://localhost:3333/usuarios

    const users = await prisma.patients.findMany()

    return res.status(200).json(users)
})

//------------------------------------------------------------------
//ROTA GET (BUSCA UM USUÁRIO ATRAVÉS DO CPF)
//------------------------------------------------------------------

app.get('/buscar/usuario/:cpf', async (req, res) => {
    try {
        const cpf = req.params.cpf.replace(/\D/g, ''); // remove pontos e traços

        const user = await prisma.patients.findFirst({
            where: { cpf }
        });

        if (!user) {
            return res.status(404).json({ error: "Usuário não encontrado" });
        }

        return res.status(200).json(user);
    } catch (error) {
        console.error(error); // mostra o erro no console
        return res.status(500).json({ error: "Erro interno", details: error.message });
    }
});

//------------------------------------------------------------------
//ROTA PUT (ATUALIZA OS DADOS DE UM USUÁRIO)
//------------------------------------------------------------------

app.put('/usuarios/:cpf', async (req, res) => { // URL: http://localhost:3333/usuarios/:cpf
    try {
        const cpfParam = req.params.cpf
        const { name, dataNascimento, telefone, email, planoSaude } = req.body

        // Formata o CPF que veio na URL
        const cpfFormatado = cpfParam.replace(/\D/g, '')
        if (cpfFormatado.length !== 11) {
            return res.status(400).json({ error: "CPF inválido, deve conter 11 dígitos numéricos" })
        }

        const usersUpdate = await prisma.patients.update({
            where: { cpf: cpfFormatado }, // busca pelo CPF único
            data: {
                name,
                dataNascimento: dataNascimento ? new Date(dataNascimento) : undefined,
                telefone,
                email,
                planoSaude
            }
        })

        return res.status(200).send(usersUpdate)
    } catch (error) {
        res.status(500).json({ error: "Erro ao atualizar paciente", details: error.message })
    }
})

//------------------------------------------------------------------
//ROTA DELETE (REMOVE UM USUÁRIO)
//------------------------------------------------------------------

app.delete('/usuarios/:cpf', async (req, res) => { // URL: http://localhost:3333/usuarios/:id

    const cpf = req.params.cpf.replace(/\D/g, '');

    const userDeleted = await prisma.patients.delete({
        where: { cpf }
    })

    return res.status(200).send({ mensagem: "Usuário Deletado com sucesso!", userDeleted });

});

