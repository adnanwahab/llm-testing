
# from faster_whisper import WhisperModel

# model_size = "large-v2"

# # Run on GPU with FP16
# model = WhisperModel(model_size, device="cuda", compute_type="float16")

# # or run on GPU with INT8
# # model = WhisperModel(model_size, device="cuda", compute_type="int8_float16")
# # or run on CPU with INT8
# # model = WhisperModel(model_size, device="cpu", compute_type="int8")

# segments, info = model.transcribe("audio.mp3", beam_size=5)

# print("Detected language '%s' with probability %f" % (info.language, info.language_probability))

# for segment in segments:
#     print("[%.2fs -> %.2fs] %s" % (segment.start, segment.end, segment.text))



import json



# Save the JSON data to the file
def saveJSON(file_path, data): 
    print(file_path)
    with open(file_path, "w") as json_file:
        json.dump(data, json_file)




# from openlrc import LRCer

# lrcer = LRCer()


# from faster_whisper import WhisperModel

# model_size = "large-v2"

# # Run on GPU with FP16
# model = WhisperModel(model_size, device="cuda", compute_type="float16")

# or run on GPU with INT8
# model = WhisperModel(model_size, device="cuda", compute_type="int8_float16")
# or run on CPU with INT8
# model = WhisperModel(model_size, device="cpu", compute_type="int8")

def transcribe(fp):
    print(fp)
    info = model.transcribe(fp, beam_size=5)
    saveJSON(''.join(os.path.splitext(fp)[:-1]) + '.json', info)
    #lrcer.run(fp, target_lang='en') 
    #print("Detected language '%s' with probability %f" % (info.language, info.language_probability))
    #return 








import timeit

import whisper
print('hello')
model = whisper.load_model("medium.en")

import os

main_dir = '../../../mnt/d/media'

# execution_time = timeit.timeit(transcribe, number=100)  # Run the function 100 times
# print(f"Execution time: {execution_time:.6f} seconds")

def get_all_files_in_directory(directory):
    file_list = []
    for root, dirs, files in os.walk(directory):
        for file in files:
            file_list.append(os.path.join(root, file))
    return file_list

# Replace 'your_directory_path' with the path to the directory you want to search
directory_path = main_dir
all_files = get_all_files_in_directory(directory_path)

# Printing all the file paths found in the directory and its subdirectories
for file_path in all_files:
    #print(file_path)
    ext = os.path.splitext(file_path)[-1].lower()
    #print(ext)
    if ext == '.mp4' or ext == '.mp3': 
        transcribe(file_path)








# import whisper=========

# model = whisper.load_model("medium.en")

# # load audio and pad/trim it to fit 30 seconds
# # audio = whisper.load_audio("audio.mp3")


# result = model.transcribe("audio.mp3")
# print(result["text"])




# import whisper
# print(whisper)
# model = whisper.load_model("base")

# # load audio and pad/trim it to fit 30 seconds
# audio = whisper.load_audio("audio.mp3")
# audio = whisper.pad_or_trim(audio)

# # make log-Mel spectrogram and move to the same device as the model
# mel = whisper.log_mel_spectrogram(audio).to(model.device)

# # detect the spoken language
# _, probs = model.detect_language(mel)
# print(f"Detected language: {max(probs, key=probs.get)}")

# # decode the audio
# options = whisper.DecodingOptions()
# result = whisper.decode(model, mel, options)

# print the recognized

