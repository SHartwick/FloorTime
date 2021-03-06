# This script runs the diarization pipeline from an audio file to JSON output
# input: name, extension of audio file to be diarized

import WavConverter
import SegParser
import Diarizer
import sys
import wave

name = sys.argv[1]
data= []

num_files = (len(sys.argv)-2)/2

# for all files given
for i in range(2,len(sys.argv),2):

    # strip the arguments
    tag = sys.argv[i];
    filetype = sys.argv[i+1];

    # put the file in the correct format
    WavConverter.translateAudioToWav(tag,tag,filetype)

    fileName = '/tmp/'+tag+'.wav'

    w = wave.open(fileName, 'rb')

    data = data + [[w.getparams(), w.readframes(w.getnframes())]]
    w.close()

# initialize the output file
outfile = '/tmp/'+name+'.wav'
output = wave.open(outfile, 'wb')
output.setparams(data[0][0])

# write the frames for all the files
for i in range(0,num_files):
    output.writeframes(data[i][1])

# close the output
output.close()

# run the lium jar on the wav file
Diarizer.runLium(name)

# translate the output to a JSON object
SegParser.translateSegToJSON(name)
