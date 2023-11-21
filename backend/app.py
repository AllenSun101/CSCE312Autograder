from flask import Flask, request
from flask_cors import CORS

app = Flask(__name__)
CORS(app)  # Enable CORS for all routes

@app.route('/', methods=['POST'])
def autograder():

    if len(request.files) == 0:
        return [{"Global Error" : "No files added"}]

    tst_files = {}
    cmp_files = {}
    hdl_files = {}
    asm_files = {}

    for i in request.files:
        # Check that files are either .hdl, .asm, .tst, or .cmp
        # Add file to dictionary, formatted file_name: file_content

        file_name = request.files[i].filename
        extension = file_name[-4:]
        file_content = request.files[i].read()

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
        print(file_name)
        hdl_file_name = ""
        cmp_file_name = ""

        # Parse cmp file

        # Parse hdl/asm file


    tests = [{"Input 1": 0, "Input 2": 1, "Input 3": 1, "Expected": 0, "Output": 1}, 
             {"Input 1": 1, "Input 2": 1, "Expected": 1, "Output": 1},
             {"Input 1": 1, "Input 2": 1, "Expected": 1, "Output": 1}]
    return tests


if __name__ == '__main__':
    app.run(debug=True)