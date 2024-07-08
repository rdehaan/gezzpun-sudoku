// This file is released under the MIT license.
// See LICENSE.md.
//
// The code in this file is taken (in modified form) from:
// https://github.com/potassco/potassco.github.io

var ClingoModule = {};
var outputElement = document.getElementById('output');
var runButton = document.getElementById('run');
var ex = document.getElementById("examples");
var exrule = document.getElementById("example-rules");
var excons = document.getElementById("example-constraints");
load_example_from_path(ex.value);
var output = "";

var input_program = ace.edit("input_program");
input_program.setTheme("ace/theme/textmate");
input_program.$blockScrolling = Infinity;
input_program.setOptions({
  useSoftTabs: true,
  tabSize: 2,
  maxLines: Infinity,
  mode: "ace/mode/gringo",
  autoScrollEditorIntoView: true
});

var constraint_program = ace.edit("constraint_program");
constraint_program.setTheme("ace/theme/textmate");
constraint_program.$blockScrolling = Infinity;
constraint_program.setOptions({
  useSoftTabs: true,
  tabSize: 2,
  maxLines: Infinity,
  mode: "ace/mode/gringo",
  autoScrollEditorIntoView: true
});

function load_example() {
  load_example_from_path(ex.value);
}

var stored_programs = {}
function save_stored_program(name, program) {
    stored_programs[name] = program;
}
function load_named_program(name, path) {
    var request = new XMLHttpRequest();
    request.onreadystatechange = function() {
      if (request.readyState == 4 && request.status == 200) {
        program = request.responseText.trim()
        save_stored_program(name, program);
      }
    }
    request.open("GET", path, true);
    request.send();
}
load_named_program("metaD", "stored/metaD.lp")
load_named_program("meta", "stored/meta.lp")
load_named_program("glue", "stored/glue.lp")
load_named_program("generate", "stored/generate.lp")
load_named_program("marker", "stored/marker.lp")
load_named_program("heuristics", "stored/heuristics.lp")

function load_example_from_path(path) {
  var request = new XMLHttpRequest();
  request.onreadystatechange = function() {
    if (request.readyState == 4 && request.status == 200) {
      input_program.setValue(request.responseText.trim(), -1);
    }
  }
  request.open("GET", path, true);
  request.send();
}

function add_example_rule() {
  add_rule_from_path(exrule.value);
}

function add_rule_from_path(path) {
  var request = new XMLHttpRequest();
  request.onreadystatechange = function() {
    if (request.readyState == 4 && request.status == 200) {
      old_program = input_program.getValue() + "\n\n";
      input_program.setValue(old_program + request.responseText.trim(), -1);
    }
  }
  request.open("GET", path, true);
  request.send();
}

function add_example_constraint() {
  add_constraint_from_path(excons.value);
}

function add_constraint_from_path(path) {
  var request = new XMLHttpRequest();
  request.onreadystatechange = function() {
    if (request.readyState == 4 && request.status == 200) {
      old_program = constraint_program.getValue() + "\n\n";
      constraint_program.setValue(old_program + request.responseText.trim(), -1);
    }
  }
  request.open("GET", path, true);
  request.send();
}

function solve() {
  output = "";
  document.getElementById("run").disabled = true;
  sudoku_clear_board();
  clear_sudoku();
  clearLog();

  precomputed_solution = "";
  currentlyReifying = false;
  currentlyPrecomputing = true;
  options = "-n1 -Wnone";
  options += " --heuristic=Domain"
  program = input_program.getValue() + "\n";
  program += generateToprowRandomHeuristic() + "\n";
  program += stored_programs["generate"] + "\n";
  program += stored_programs["marker"] + "\n";
  console.log(program)
  ClingoModule.ccall('run', 'number', ['string', 'string'], [program, options])
  ClingoModule.setStatus("\n===\n");

  reified_program = "";
  currentlyReifying = true;
  currentlyPrecomputing = false;
  options = "--output=reify --reify-sccs -Wnone";
  program = input_program.getValue() + "\n";
  program += stored_programs["generate"] + "\n";
  ClingoModule.ccall('run', 'number', ['string', 'string'], [program, options])

  currentlyReifying = false;
  currentlyPrecomputing = false;
  program = input_program.getValue() + "\n";
  program += stored_programs["generate"] + "\n";
  program += constraint_program.getValue() + "\n";
  program += stored_programs["glue"];
  program += stored_programs["marker"] + "\n";
  program += reified_program + "\n";
  program += stored_programs["metaD"] + "\n";
  program += precomputed_solution + "\n";
  program += stored_programs["heuristics"] + "\n";
  // console.log(generateRandomPuzzleHeuristic());
  // clearOutput();
  // addToOutput(program);

  options = "-n1 -Wnone --solve-limit=30000"; // --solve-limit=100000
  options += " --heuristic=Domain"
  ClingoModule.ccall('run', 'number', ['string', 'string'], [program, options])

  // currentlyReifying = false;
  // options = "-n1 -Wnone";
  // ClingoModule.ccall('run', 'number', ['string', 'string'], [marker_program + input.getValue(), options])
  // ClingoModule.setStatus("Done solving..");

  updateOutput();
  document.getElementById("run").disabled = false;
}

function clearOutput() {
  output = "";
  updateOutput();
}

function addToOutput(text) {
  if (output == "") {
      output += text;
  } else {
      output += "\n" + text;
  }
  updateOutput();
}

function updateOutput() {
  if (outputElement) {
    outputElement.textContent = output;
    outputElement.scrollTop = outputElement.scrollHeight; // focus on bottom
  }
}

reified_program = "";
precomputed_solution = "";
currentlyReifying = false;
currentlyPrecomputing = true;
function handleModel(line) {
  if (currentlyPrecomputing) {
    atoms = line.split(" ");
    atoms.forEach(function (atom, index) {
      if (atom.startsWith("solution")) {
        precomputed_solution += atom + ".\n";
      }
    });
  }
  else {
    sudoku_clear_board();
    clear_sudoku();
    atoms = line.split(" ");
    atoms.forEach(function (atom, index) {
        atom_obj = parse_puzzle_atom(atom);
        if (atom_obj != null && !atom_obj.auxiliary && atom_obj.positive) {
            sudoku_set_cell_value(atom_obj.i, atom_obj.j, atom_obj.val);
        }
        sudoku_render_board();
    });
    addToLog(sudoku_board_to_string());
  }
}
function handleOutputLine(line) {
    if (currentlyReifying) {
        reified_program += line + "\n";
    }
    else {
        addToOutput(line);
        if (String(line).includes("answer_set")) {
            handleModel(line);
        }
    }
};

const version = '0.3.0';

d3.require(`wasm-clingo@${version}`).then(Clingo => {
    const Module = {
        locateFile: (file) => `https://cdn.jsdelivr.net/npm/wasm-clingo@${version}/${file}`,
        print: function(text) {
            handleOutputLine(text);
        },
        printErr: function(err) {
            Module.setStatus('Error')
            console.error(err)
        },
        setStatus: function(text) {
            addToOutput(text);
            updateOutput();
        },
        totalDependencies: 0,
        monitorRunDependencies: function(left) {
            this.totalDependencies = Math.max(this.totalDependencies, left);
            Module.setStatus(left ? 'Preparing... (' + (this.totalDependencies-left) + '/' + this.totalDependencies + ')' : 'All downloads complete.');
        }
    }

    window.onerror = function(event) {
        Module.setStatus('Exception thrown, see JavaScript console');
        Module.setStatus = function(text) {
            if (text) Module.printErr('[post-exception status] ' + text);
        };
    };
    Module.setStatus('Downloading...');

    Clingo(Module).then(clingo => {
        ClingoModule = clingo;
        document.getElementById("run").disabled = false;
    });

});

var QueryString = function () {
  var query_string = {};
  var query = window.location.search.substring(1);
  var vars = query.split("&");
  for (var i=0;i<vars.length;i++) {
    var pair = vars[i].split("=");
    if (typeof query_string[pair[0]] === "undefined") {
      query_string[pair[0]] = decodeURIComponent(pair[1]);
    } else if (typeof query_string[pair[0]] === "string") {
      var arr = [ query_string[pair[0]],decodeURIComponent(pair[1]) ];
      query_string[pair[0]] = arr;
    } else {
      query_string[pair[0]].push(decodeURIComponent(pair[1]));
    }
  }
  return query_string;
}();

if (QueryString.example !== undefined) {
  ex.value = "/clingo/run/examples/" + QueryString.example;
  load_example("/clingo/run/examples/" + QueryString.example);
}

function generateRandomPermutation(n) {
  let permutation = Array
    .from({ length: n }, (_, i) => i + 1);

  for (let i = n - 1; i > 0; i--) {
    const j = Math
      .floor(Math.random() * (i + 1));
    [permutation[i], permutation[j]]
      =
      [permutation[j], permutation[i]];
  }

  return permutation;
}

function generateToprowRandomHeuristic() {
  permutation = generateRandomPermutation(9);
  program = ""
  permutation.forEach(function (value, index) {
    program += "#heuristic solution(1," + (index+1)
    program += "," + value + "). [10,true]\n"
  });
  return program;
}

function generateRandomPuzzleHeuristic() {
  num_cells_to_fill = 5
  program = ""
  for (let i = 0; i < num_cells_to_fill; i++) {
    const r = Math.floor(Math.random() * 9) + 1;
    const c = Math.floor(Math.random() * 9) + 1;
    program += "#heuristic puzzle("
    program += r + "," + c
    program += ",V) : solution(" + r + "," + c + ","
    program += "V). [10,true]\n"
  }
  return program;
}
