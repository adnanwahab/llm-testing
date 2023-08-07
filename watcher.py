import subprocess

filename = 'my_python_code_A.py'
while True:
    """However, you should be careful with the '.wait()'"""
    p = subprocess.Popen('python transcribe.py', shell=True).wait()

    """#if your there is an error from running 'my_python_code_A.py', 
    the while loop will be repeated, 
    otherwise the program will break from the loop"""
    if p != 0:
        continue
    else:
        break