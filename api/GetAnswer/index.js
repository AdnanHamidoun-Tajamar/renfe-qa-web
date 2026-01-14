const axios = require('axios');

module.exports = async function (context, req) {
    const question = req.body && req.body.question;
    
    // 1. Verificamos que las variables de entorno existan
    const endpoint = process.env.AZURE_ENDPOINT;
    const key = process.env.AZURE_LANGUAGE_KEY;

    if (!endpoint || !key) {
        context.res = { 
            status: 500, 
            body: { answer: "Error: Faltan las variables de configuración en Azure." } 
        };
        return;
    }

    try {
        // 2. Limpiamos el endpoint por si tiene una barra al final
        const cleanEndpoint = endpoint.endsWith('/') ? endpoint.slice(0, -1) : endpoint;

        const response = await axios.post(
            `${cleanEndpoint}/language/:query-knowledgebases?projectName=FaqsRenfe&api-version=2021-10-01&deploymentName=production`,
            { top: 1, question: question },
            { 
                headers: { 
                    "Ocp-Apim-Subscription-Key": key, 
                    "Content-Type": "application/json" 
                } 
            }
        );

        context.res = {
            body: { answer: response.data.answers[0].answer }
        };
    } catch (error) {
        context.res = {
            status: 500,
            body: { answer: "Error al conectar con el servicio de IA de Azure." }
        };
    }
};