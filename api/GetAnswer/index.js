const axios = require('axios');

module.exports = async function (context, req) {
    // Leemos la pregunta que viene de tu web
    const question = req.body && req.body.question;
    
    if (!question) {
        context.res = { status: 400, body: "Falta la pregunta" };
        return;
    }

    // Estas variables las leerá Azure de su panel de configuración
    const endpoint = process.env.AZURE_ENDPOINT;
    const key = process.env.AZURE_LANGUAGE_KEY;
    const projectName = "FaqsRenfe";
    const deploymentName = "production";

    try {
        const response = await axios.post(
            `${endpoint}/language/:query-knowledgebases?projectName=${projectName}&api-version=2021-10-01&deploymentName=${deploymentName}`,
            { top: 1, question: question },
            { 
                headers: { 
                    "Ocp-Apim-Subscription-Key": key, 
                    "Content-Type": "application/json" 
                } 
            }
        );

        // Devolvemos solo la respuesta a tu HTML
        context.res = {
            body: { answer: response.data.answers[0].answer }
        };
    } catch (error) {
        context.res = {
            status: 500,
            body: "Error conectando con el cerebro de Azure"
        };
    }
};