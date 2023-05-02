const APP_ENV = process.env.APP_ENV;

let update = {};

if(APP_ENV === "dev"){
    update = {
        name:"Razz(Dev)"
    }
}else if(APP_ENV === "prod"){
    update = {
        name:"Razz"
    }
}else if(APP_ENV === "staging"){
    update = {
        name:"Razz(Stag)"
    }
}


export default ({config}) => {
    return {
        ...config,
        ...update
    }
}