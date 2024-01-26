const express = require('express');
const { google } = require('googleapis');

const app = express();


//Middleware para permitir o uso de JSON no corpo das requisições.
app.use(express.json())


//AUTENTICAÇÃO
async function getAuthSheets() {

    // Cria uma autenticação usando as credenciais do arquivo JSON
    const auth = new google.auth.GoogleAuth({
        keyFile: "dev-training-project-412418-482e93ec2b73.json",

    // Define os escopos necessários
        scopes: "https://www.googleapis.com/auth/spreadsheets"
    })

    // Obtém um cliente autenticado
    const client = await auth.getClient();

    // Cria uma instância da API do Google Sheets
    const googleSheets = google.sheets({
        version: "v4",
        auth: client
    })


    const spreadsheetId = "1-MjiM3OfM1MTR3FK-jw88DLqMmU-dSql30c71g5RZgU"

    // Retorna um objeto com as informações necessárias para operar na planilha
    return {
        auth,
        client,
        googleSheets,
        spreadsheetId
    }
}

//GET METADATA DA PLANILHA

app.get("/metadata", async (req, res) => {

    // Obtém as informações de autenticação
    const { googleSheets, auth, spreadsheetId } = await getAuthSheets();

    // Obtém os metadados da planilha
    const metadata = await googleSheets.spreadsheets.get({
        auth,
        spreadsheetId
    })
    // Envia os metadados como resposta
    res.send(metadata.data)
})


//GET ROWS DA PLANILHA
app.get("/rows", async (req, res) => {

    // Obtém as informações de autenticação
    const { googleSheets, auth, spreadsheetId } = await getAuthSheets();

    // Obtém as linhas da planilha
    const rows = await googleSheets.spreadsheets.values.get({
        auth,
        spreadsheetId,
        range: "engenharia_de_software"
    })

    // Envia as linhas como resposta
    res.send(rows.data)

})


//ADD VALUE NA PLANILHA
app.post("/addRow", async (req, res) => {

    // Obtém as informações de autenticação
    const { googleSheets, auth, spreadsheetId } = await getAuthSheets();

    // Obtém os valores do corpo da requisição
    const { values } = req.body

    // Adiciona uma nova linha à planilha com os valores fornecidos
    const row = await googleSheets.spreadsheets.values.append({
        auth,
        spreadsheetId,
        range: "engenharia_de_software",
        valueInputOption: "USER_ENTERED",
        resource: {
            values: values
        }
    });

    // Envia a nova linha como resposta
    res.send(row.data)
})

//PUT VALUE NA PLANILHA
app.put("/putValue", async (req, res) => {

    // Obtém os valores do corpo da requisição
    const { values } = req.body

    // Obtém as informações de autenticação
    const { googleSheets, auth, spreadsheetId } = await getAuthSheets();

    // Atualiza os valores na planilha
    const updateValue = await googleSheets.spreadsheets.values.update({
        auth,
        spreadsheetId,
        range: "engenharia_de_software",
        valueInputOption: "USER_ENTERED",
        resource: {
            values: values
        }
    });

    // Envia os valores atualizados como resposta
    res.send(updateValue.data)
})

//PATCH VALUE NA PLANILHA
app.patch("/putValue/:id", async (req, res) => {

    // Obtém o ID da linha a ser atualizada a partir dos parâmetros da URL
    const resourceId = req.params.id;

    // Obtém os valores do corpo da requisição
    const { values } = req.body;

    // Obtém as informações de autenticação
    const { googleSheets, auth, spreadsheetId } = await getAuthSheets();

    // Atualiza os valores na linha específica da planilha
    const updateValue = await googleSheets.spreadsheets.values.update({
        auth,
        spreadsheetId,
        range: `engenharia_de_software!${resourceId}`,
        valueInputOption: "USER_ENTERED",
        resource: {
            values: values
        }
    });

    // Envia os valores atualizados como resposta
    res.send(updateValue.data)
})


//CRIAÇÃO DO SERVIDOR
app.listen(3001, () => console.log("Running on port 3001"));

