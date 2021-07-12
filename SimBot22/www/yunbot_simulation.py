import pyaudio
import wave
import speech_recognition as sr
import time
import os
import tkinter as tk

CHUNK = 1024
FORMAT = pyaudio.paInt16
CHANNELS = 2
RATE = 44100
RECORD_SECONDS = 5
WAVE_OUTPUT_FILENAME = "output.wav"

def record():
    p = pyaudio.PyAudio()

    stream = p.open(format=FORMAT,
                    channels=CHANNELS,
                    rate=RATE,
                    input=True,
                    frames_per_buffer=CHUNK)

    # print("* recording")

    frames = []

    for i in range(0, int(RATE / CHUNK * RECORD_SECONDS)):
        data = stream.read(CHUNK)
        frames.append(data)

    # print("* done recording")

    stream.stop_stream()
    stream.close()
    p.terminate()

    wf = wave.open(WAVE_OUTPUT_FILENAME, 'wb')
    wf.setnchannels(CHANNELS)
    wf.setsampwidth(p.get_sample_size(FORMAT))
    wf.setframerate(RATE)
    wf.writeframes(b''.join(frames))
    wf.close()
def recordAudio():
    # print("start")
    record()
    # Record Audio
    r = sr.Recognizer()
    #with sr.AudioFile(WAVE_OUTPUT_FILENAME) as source:
    with sr.AudioFile(WAVE_OUTPUT_FILENAME) as source:
        audio = r.record(source)

    # Speech recognition using Google Speech Recognition
    data = ""
    try:
        # Uses the default API key
        # To use another API key: `r.recognize_google(audio, key="GOOGLE_SPEECH_RECOGNITION_API_KEY")`
        data = r.recognize_google(audio)
        print( data)
        # label.configure(text=data)
        
    except sr.UnknownValueError:
        # label.configure(text="Google Speech Recognition could not understand audio")
        print("Google Speech Recognition could not understand audio")
    except sr.RequestError as e:
        print("Could not request results from Google Speech Recognition service; {0}".format(e))

    return data
if __name__ == '__main__':
    # record()
    recordAudio()
    # print('Over!') 
    # window = tk.Tk()

    # window.title('BMI App')
    # window.geometry('800x600')
    # #window.configure(background='white')
    # #label=tk.Label(window, text="test") 
    # #label.pack()
    # label=tk.Label(window) 
    # label.pack()
    # button=tk.Button(window, text="record",command=recordAudio)
    # button.pack() 

    # window.mainloop()