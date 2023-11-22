from flask import Flask, request
from flask_cors import CORS
import re

app = Flask(__name__)
CORS(app)  # Enable CORS for all routes

def parse_tst(file_content):
    lines = [line.strip() for line in file_content.decode('utf-8').split('\n') if line.strip()]
    load_file = None
    compare_file = None

    for line in lines:
        tokens = line.split(" ")
        #print(tokens)
        if tokens[0].strip() == "load":
            load_file = tokens[1][:-1]
        elif tokens[0].strip() == "compare-to":
            compare_file = tokens[1][:-1]

    return load_file, compare_file


def parse_cmp(file_content):
    pass


def parse_hdl_asm(file_content):
    pass


@app.route('/', methods=['POST'])
def autograder():

    files = request.files.getlist('files[]')

    if len(files) == 0:
        return [{"Global Error" : "No files added"}]
    
    tst_files = {}
    cmp_files = {}
    hdl_files = {}
    asm_files = {}

    for file in files:
        # Check that files are either .hdl, .asm, .tst, or .cmp
        # Add file to dictionary, formatted file_name: file_content

        file_name = file.filename
        extension = file_name[-4:]
        file_content = file.read()

        if extension == '.hdl':
            hdl_files[file_name] = file_content
        elif extension == '.asm':
            asm_files[file_name] = file_content
        elif extension == '.tst':            
            tst_files[file_name] = file_content
        elif extension == '.cmp':
            cmp_files[file_name] = file_content

    if len(tst_files) == 0:
        return [{"Global Error" : "Missing .tst file"}]
    
    # Parse tst file and get .cmp file and .hdl/.asm file
    for tst_file_name in tst_files:
        tst_file = tst_files[tst_file_name]

        parsed_tst = parse_tst(tst_file)

        hdl_asm_file_name = parsed_tst[0]
        cmp_file_name = parsed_tst[1]

        # print(hdl_asm_file_name + " | " + cmp_file_name)

        if hdl_asm_file_name[-4:] == '.hdl' and hdl_asm_file_name not in hdl_files:
            return [{"Global Error" : "Missing .hdl file"}]
        elif hdl_asm_file_name[-4:] == '.asm' and hdl_asm_file_name not in asm_files:
            return [{"Global Error" : "Missing .asm file"}]
        elif cmp_file_name not in cmp_files:
            return [{"Global Error" : "Missing .cmp file"}]
        
        # Parse cmp file

        # Parse hdl/asm file

        # Add test cases in output


    tests = [{"Input 1": 0, "Input 2": 1, "Input 3": 1, "Expected": 0, "Output": 1}, 
             {"Input 1": 1, "Input 2": 1, "Expected": 1, "Output": 1},
             {"Input 1": 1, "Input 2": 1, "Expected": 1, "Output": 1}]
    
    return tests


if __name__ == '__main__':
    app.run(debug=True)