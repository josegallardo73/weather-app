export const db = new Localbase('weathers');
db.config.debug = false;


export const addWeatherDB = (weather) => {
    db.collection('weathers')
        .add(weather)
            .then(response => {
                console.log('Se guardo la información correctamente');
            })
            .catch(err => console.log('Se produjo un error al guardar la información'));
}


export const getWeathers = async () => {
    let results = null;
    try {
        results = await db.collection('weathers').get()
    }catch(err) {
        console.log('Error: ', err);
    }
    return results;
}

export const deleteWeather = (index) => {
    db.collection('weathers')
        .doc({id: index})
        .delete()
        .then(console.log('Se elimino la información correctamente'))
        .cath(err => {
            console.log('Se produjo un error al eliminar la información');
        })
}