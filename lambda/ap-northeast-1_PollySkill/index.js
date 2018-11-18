'use strict'

const Alexa = require('ask-sdk');

const languageSentence = {
    'de-DE':{'first':'Hallo, mein Name ist ', 'second':'. Ich werde jeden Text vorlesen, den Sie eingeben.'},
    'it-IT':{'first':'Ciao, mi chiamo ', 'second':'. Leggerò qualsiasi testo che digiterai qui.'},
    'ja-JP':{'first':'こんにちは、', 'second':'です。読みたいテキストをここに入力してください。'},
    'es-ES':{'first':'Hola! Me llamo ', 'second':'. Puedo leer cualquier texto que escribas.'},
    'fr-FR':{'first':"Salut, je m'appelle ", 'second':'. Je vais lire le texte que vous écrirez ici.'},
    'en-US':{'first':'Hi! My name is ', 'second':'. I will read any text you type here.'},
    'en-AU':{'first':'Hi there, my name is ', 'second':'. I will read any text you type here.'},
    'en-GB':{'first':'Hi! My name is ', 'second':'. I will read any text you type here.'},
    'en-IN':{'first':'Hi! My name is ', 'second':'. I can read any text you type here.'}
};

async function Response(handlerInput,language,langCode,slotName){
    let request = handlerInput.requestEnvelope.request;
    //DialogStateの値を取得
    const {dialogState} = request;
    //スロットID取得用の変数宣言
    let name;

    if(dialogState !== 'COMPLETED'){//必須スロットが全て埋まっていない場合の処理
    
        //responseをダイアログに任せる    
        return handlerInput.responseBuilder
            .addDelegateDirective()
            .getResponse();

    }else{//必須スロットが全部埋まった場合の処理
    
        //必須スロットのIDを取得
        name = request.intent.slots[slotName].resolutions.resolutionsPerAuthority[0].values[0].value.id;

        //文を宣言
        const languageSpeech = '<voice name=' + '"' + name + '"' + '><lang xml:lang="' + langCode + '">' + await additionSentence(name,langCode) + '</lang></voice><p>言語は' + language + '、話者は' + name + 'でした。</p>';
        const askSpeech = "他に例文を聞きたい言語がある場合は教えてください";
        const speech = "<speak>" + languageSpeech + askSpeech + "</speak>";

        return handlerInput.responseBuilder
            .speak(speech)
            .reprompt(askSpeech)
            .getResponse();
    }
};

function additionSentence(name,langCode){
return languageSentence[langCode].first + name + languageSentence[langCode].second
}
 
let skill;
exports.handler = async function (event, context) {
    if (!skill) {
      skill = Alexa.SkillBuilders.standard()
        .addRequestHandlers(
            LaunchRequestHandler,
            DEHandler,
            ITHandler,
            JPHandler,
            FRHandler,
            ESHandler,
            USHandler,
            AUHandler,
            GBHandler,
            INHandler,
            EnglishHandler,
            SessionEndedRequestHandler,
            CancelAndStopIntentHandler
        )
        .withTableName('PollyTestSkillTable')
        .withAutoCreateTable(true)
        .addErrorHandlers(ErrorHandler)
        .create();
    }
    return skill.invoke(event);
};

const LaunchRequestHandler = {
    canHandle(handlerInput) {
        return handlerInput.requestEnvelope.request.type === "LaunchRequest"
        },
    async handle(handlerInput) {
        //DynamoDBから永続化情報を取得
        let PersistentAttributes = await handlerInput.attributesManager.getPersistentAttributes();
        //response文を格納する変数を宣言(初回と2回目以降で文が違うのでlet、speakとresponse文の為に２つ)
        let launchSpeech,askSpeech,speech;
        //2回目以降のresponse文
        launchSpeech = "";
        askSpeech = "例文を聞きたい言語、または話者の名前を言ってください。";
        //時間の永続化情報がない時(初回利用の時)response文を変更
        if(!PersistentAttributes.Description){
            launchSpeech = "ポリーテストではアマゾンポリーを利用した各言語のサンプル音声を聞くことができます。対応言語は9種類、話者は27名です。";
            askSpeech = "例文を聞きたい言語を言ってください。また、話者の名前がわかっている場合は名前を直接言ってもその話者の言語の例文を聞くことができます。言語の種類を聞きたい場合は、ヘルプと言ってください。";
            PersistentAttributes.Description = 1;
        }

        //response文の形成
        speech = launchSpeech + askSpeech;

        return handlerInput.responseBuilder
            .speak(speech)
            .reprompt(askSpeech)
            .getResponse();
    }
};

const DEHandler = {
    canHandle(handlerInput) {
        return handlerInput.requestEnvelope.request.type === "IntentRequest"
            && handlerInput.requestEnvelope.request.intent.name === "DEIntent";
    },
    handle(handlerInput) {
        return Response(handlerInput,'ドイツ語','de-DE','DEName');
    }
};

const ITHandler = {
    canHandle(handlerInput) {
        return handlerInput.requestEnvelope.request.type === "IntentRequest"
            && handlerInput.requestEnvelope.request.intent.name === "ITIntent";
    },
    handle(handlerInput) {
        return Response(handlerInput,'イタリア語','it-IT','ITName');
    }
};

const JPHandler = {
    canHandle(handlerInput) {
        return handlerInput.requestEnvelope.request.type === "IntentRequest"
            && handlerInput.requestEnvelope.request.intent.name === "JPIntent";
    },
    handle(handlerInput) {
        return Response(handlerInput,'日本語','ja-JP','JPName');
    }
};

const FRHandler = {
    canHandle(handlerInput) {
        return handlerInput.requestEnvelope.request.type === "IntentRequest"
            && handlerInput.requestEnvelope.request.intent.name === "FRIntent";
    },
    handle(handlerInput) {
        return Response(handlerInput,'フランス語','fr-FR','FRName');
    }
}

const ESHandler = {
    canHandle(handlerInput) {
        return handlerInput.requestEnvelope.request.type === "IntentRequest"
            && handlerInput.requestEnvelope.request.intent.name === "ESIntent";
    },
    handle(handlerInput) {
        return Response(handlerInput,'スペイン語','es-ES','ESName');
    }
}

const USHandler = {
    canHandle(handlerInput) {
        return handlerInput.requestEnvelope.request.type === "IntentRequest"
            && handlerInput.requestEnvelope.request.intent.name === "USIntent";
    },
    handle(handlerInput) {
        return Response(handlerInput,'アメリカ英語','en-US','USName');
    }
};

const AUHandler = {
    canHandle(handlerInput) {
        return handlerInput.requestEnvelope.request.type === "IntentRequest"
            && handlerInput.requestEnvelope.request.intent.name === "AUIntent";
    },
    handle(handlerInput) {
        return Response(handlerInput,'オーストラリア英語','en-AU','AUName');
    }
};

const GBHandler = {
    canHandle(handlerInput) {
        return handlerInput.requestEnvelope.request.type === "IntentRequest"
            && handlerInput.requestEnvelope.request.intent.name === "GBIntent";
    },
    handle(handlerInput) {
        return Response(handlerInput,'イギリス英語','en-GB','GBName');
    }
};

const INHandler = {
    canHandle(handlerInput) {
        return handlerInput.requestEnvelope.request.type === "IntentRequest"
            && handlerInput.requestEnvelope.request.intent.name === "INIntent";
    },
    handle(handlerInput) {
        return Response(handlerInput,'インド英語','en-IN','INName');
    }
};

const EnglishHandler = {
    canHandle(handlerInput) {
        return handlerInput.requestEnvelope.request.type === "IntentRequest"
            && handlerInput.requestEnvelope.request.intent.name === "EnglishIntent";
    },
    handle(handlerInput) {
        const englishSpeech = "英語にはアメリカ、オーストラリア、イギリス、インドの四種類があります。";
        const askSpeech = "どの種類の英語にしますか。";

        const speech = englishSpeech + askSpeech;

        return handlerInput.responseBuilder
            .speak(speech)
            .reprompt(askSpeech)
            .getResponse();
    }
};

const CancelAndStopIntentHandler = {

    canHandle(handlerInput){
        const request = handlerInput.requestEnvelope.request;
    
        return request.type === 'IntentRequest'
            && (request.intent.name === 'AMAZON.StopIntent'
            ||  request.intent.name === 'AMAZON.CancelIntent');
        },
    
    handle(handlerInput){
        const speech = 'わかりました、終了します。';
        return handlerInput.responseBuilder
            .speak(speech)
            .getResponse();
    }
};

const SessionEndedRequestHandler = {
    canHandle(handlerInput) {
        return handlerInput.requestEnvelope.request.type === 'SessionEndedRequest';
    },
    handle(handlerInput) {
        return handlerInput.responseBuilder.getResponse();
    }
};

const ErrorHandler = {
    canHandle(handlerInput, error) {
        return true;
    },
    handle(handlerInput, error) {
        const errorSpeech = ["うまくいきませんでした、ごめんなさい。","すいません、うまくいきませんでした。","失敗しました、ごめんなさい。"];
        const askSpeech = "もう一度言ってください。"

        const speech = errorSpeech(Math.floor(Math.random()*2)) + askSpeech;

        return handlerInput.responseBuilder
            .speak(speech)
            .reprompt(askSpeech)
            .getResponse();
    }
};

const HelpHandler = {
    canHandle(handlerInput) {
        return handlerInput.requestEnvelope.request.type === "IntentRequest"
            && handlerInput.requestEnvelope.request.intent.name === "AMAZON.HelpIntent";
    },
    handle(handlerInput) {
        const helpSpeech = [
            "このスキルではアマゾンポリーを利用して、アレクサで利用可能な言語、話者の例文を聞くことができます。",
            "利用可能な言語はドイツ語、スペイン語、イタリア語、日本語、フランス語、アメリカ英語、オーストラリア英語、イギリス英語、インド英語の九種類です。",
            "話者は合計で27名います。各言語話者の名前はアレクサアプリにお送りした、音声合成マークアップ言語リファレンスのボイスタグの欄をご覧ください。"
        ];

        const speech = helpSpeech[0] + helpSpeech[1] + helpSpeech[2] + askSpeech;

        const askSpeech = "聞きたい例文の言語、話者の名前を言ってください。";
        return handlerInput.responseBuilder
            .speak(speech)
            .reprompt(askSpeech)
            .withSimpleCard("音声合成マークアップ言語（SSML）のリファレンス","https://developer.amazon.com/ja/docs/custom-skills/speech-synthesis-markup-language-ssml-reference.html#tips-for-using-amazon-polly-voices")
            .getResponse();
    }
}