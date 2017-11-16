/*
  This module runs the diarization pipeline on the given fileName
  When this script finishes, data/json/<fileName-extension>.json will be ready
  to source charts with data
*/

var shell = require('shelljs');

exports.single = function(fileName) {

  // promise to diarize
  return new Promise(function(resolve,reject){

      // separate the file into it's name and extension
      periodIndex = fileName.lastIndexOf('.');
      tag = fileName.substring(0,periodIndex);
      type = fileName.substring(periodIndex+1,fileName.length);

      console.log('running diarization: python '+__dirname+ '/DiarizationPipeline.py '+tag+' '+type);

      // transfer control to the command line, calling the python script for diarization
      shell.exec('python '+__dirname+ '/DiarizationPipeline.py '+tag+' '+type, function(err,results){
        if (err) reject(err);

        // return the name of the file generated
        else {
          console.log(' finished diarization');
          resolve({
            tag: tag,
            ext: type
          });
        }
      })
  });

}


exports.multi = function(fileNames) {

  // promise to diarize
  return new Promise(function(resolve,reject){

      console.log('running diarizations');

      var now = "_"+(new Date()).getTime();

      var command = " "+now+" ";

      // go through each file given
      fileNames.forEach(function(fileName){

        // separate the file into it's name and extension
        periodIndex = fileName.lastIndexOf('.');
        tag = fileName.substring(0,periodIndex);
        type = fileName.substring(periodIndex+1,fileName.length);

        // add this file and extension to the command
        command += tag + " " + type + " ";

      });

      console.log('python '+__dirname+ '/DiarizationPipelineMulti.py '+command);

      // transfer control to the command line, calling the python script for diarization
      shell.exec('python '+__dirname+ '/DiarizationPipelineMulti.py '+command, function(err,results){
        if (err) reject(err);

        // return the name of the file generated
        else {
          console.log(' finished diarization');
          resolve({
            tag: now,
            ext: "mp3",
            files: fileNames
          });
        }
      })
  });

}
