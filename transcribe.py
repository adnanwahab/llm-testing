from pathlib import Path
import json
#from basic_pitch.inference import predict_and_save


from faster_whisper import WhisperModel

model_size = "large-v2"

# Run on GPU with FP16
model = WhisperModel(model_size, device="cuda", compute_type="float16")

def transcribe(fp):
    print(fp)
    _, file_extension = os.path.splitext(fp)

    # if file_extension:
    #     fp = _
    # else:
    #     print("File has no extension.")
    json_fp = _ + '.json'

    if Path(json_fp).is_file():
        with open(json_fp, 'r') as file:
             data_dict = json.load(file)
        return data_dict
    
  
    segments, info = model.transcribe(fp, beam_size=5)

  
    data = []
    for segment in segments:
            #print("[%.2fs -> %.2fs] %s" % (segment.start, segment.end, segment.word))
            data.append([segment.start, segment.end, segment.text])
    #print(data)
    with open(json_fp, 'w') as file:
        json.dump(data, file)
    return data



# Save the JSON data to the file
def saveJSON(file_path, data): 
    print(file_path)
    with open(file_path, "w") as json_file:
        json.dump(data, json_file)




# from openlrc import LRCer

# lrcer = LRCer()


# or run on GPU with INT8
# model = WhisperModel(model_size, device="cuda", compute_type="int8_float16")
# or run on CPU with INT8
# model = WhisperModel(model_size, device="cpu", compute_type="int8")

# def transcribe(fp):
#     print(fp)
#     info = model.transcribe(fp, beam_size=5)
#     saveJSON(''.join(os.path.splitext(fp)[:-1]) + '.json', info)
    #lrcer.run(fp, target_lang='en') 
    #print("Detected language '%s' with probability %f" % (info.language, info.language_probability))
    #return 









import os

main_dir = './TV/'

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
def is_mp3(fp):
    ext = os.path.splitext(fp)[-1].lower()
    #return ext == '.mp3'
    return True
all_files = filter(is_mp3, get_all_files_in_directory( directory_path))

# Printing all the file paths found in the directory and its subdirectories
import time
# predict_and_save(
#     [main_dir + 'dance.mp3'],
#     main_dir,
#     True,
#     True,
#     True,
#     True,
# )
music_directory_json = './node/tv_directory.json'
print('start transcbie')
if __name__ == '__main__': 
    print('indexing directory of length', (len(list(all_files))))
    print(all_files)
    cache = {}
    with open(music_directory_json, 'r') as file:
            data_dict = json.load(file)
            for key in data_dict: 
                 cache[key] = data_dict[key]
    print(f'music_directory is {len(cache)} items long.')
    for file_path in filter(is_mp3, get_all_files_in_directory( directory_path)):
        file_name = os.path.basename(file_path)
        if file_name in cache: continue
        print('transcribing ', file_path)
        t0= time.perf_counter()

        transcribe(file_path)
        t1 = time.perf_counter() - t0
        print("Time elapsed: ", t1 - t0) # CPU seconds elapsed (floating point)
        cache[file_name] = file_path
        with open(music_directory_json, 'w') as json_file:
            json.dump(cache, json_file)

