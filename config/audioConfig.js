exports.getAudio = (data, proxy = false) => {
    if (proxy) {
        return req.protocol + "://" + req.get('host') + "/chapter/getaduio/" + data.id;
    } else {
        return data?.audioFile.path;
    }
}

exports.getVedio = (data, proxy = false) => {
    if (proxy) {
        return req.protocol + "://" + req.get('host') + "/home/getvideo/" + data;
    } else {
        return data;
    }
}