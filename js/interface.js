// This file is released under the MIT license.
// See LICENSE.md.

lit_to_atom = {};
model_found = false;

var log = "";
var logElement = document.getElementById('log');
var decisions = Array();

function get_atom_from_lit(lit) {
  if (lit > 0) {
    atom = lit_to_atom[lit];
  }
  else {
    atom = "-" + lit_to_atom[-lit];
  }
  if (atom == null) {
    if (lit > 0) {
      atom = "aux(" + lit +")";
    } else {
      atom = "-aux(" + -lit + ")";
    }
  }
  return atom;
}

function interface_before_start() {
  console.log("Interface: before start");
  lit_to_atom = {};
  model_found = false;
  sudoku_initialize_candidates();
  sudoku_render_board();
  hidden_program = "";
  for (var i=0; i < board_size; i++) {
    for (var j=0; j < board_size; j++) {
      val = sudoku_get_cell_value(i,j);
      if (val != null) {
        hidden_program += "solution("+(i+1)+","+(j+1)+","+val+").\n"
      }
    }
  }
  decisions = Array();
  write_decisions_to_log();
}

function parse_puzzle_atom(atom) {
  parts = atom.split(/,|\(|\)/)
  if (atom.startsWith("puzzle(")) {
    i = parseInt(parts[1]);
    j = parseInt(parts[2]);
    v = parseInt(parts[3]);
    return {
      i: i-1,
      j: j-1,
      val: v,
      auxiliary: false,
      positive: true,
    }
  } else {
    return {
      name: atom,
      positive: true,
      auxiliary: true,
    }
  }
}

function parse_sudoku_atom(atom) {
  parts = atom.split(/,|\(|\)/)
  if (atom.startsWith("solution(")) {
    i = parseInt(parts[1]);
    j = parseInt(parts[2]);
    v = parseInt(parts[3]);
    return {
      i: i-1,
      j: j-1,
      val: v,
      auxiliary: false,
      positive: true,
    }
  } else if (atom.startsWith("-solution(")) {
    i = parseInt(parts[1]);
    j = parseInt(parts[2]);
    v = parseInt(parts[3]);
    return {
      i: i-1,
      j: j-1,
      val: v,
      auxiliary: false,
      positive: false,
    }
  } else if (atom.startsWith("-")) {
    name = atom.slice(1);
    return {
      name: name,
      positive: false,
      auxiliary: true,
    }
  } else {
    return {
      name: atom,
      positive: true,
      auxiliary: true,
    }
  }
}
function load_sudoku() {
  if (!board_blocked) {
    sudoku_initialize_board();
    sudoku_input = document.getElementById("sudoku-input").value;
    sudoku_load_from_string(sudoku_input);
    sudoku_render_board();
  }
}
function clear_sudoku() {
  if (!board_blocked) {
    sudoku_initialize_board();
    sudoku_render_board();
  }
}
function load_example_sudoku() {
  if (!board_blocked) {
    sudoku_initialize_board();
    sudoku_as_string = document.getElementById("example-sudokus").value;
    sudoku_load_from_string(sudoku_as_string);
    sudoku_render_board();
  }
}

function clearLog() {
  log = "";
  updateLog();
}

function addToLog(text) {
  log = text + "\n" + log;
  updateLog();
}

function updateLog() {
  if (logElement) {
    logElement.textContent = log;
    // logElement.scrollTop = logElement.scrollHeight; // focus on bottom
  }
}

function write_decisions_to_log() {
  if (!need_to_update_graphics()) {
    return;
  }
  log = "";
  if (decisions.length == 0) {
    log = " ";
  }
  for (let index = 0; index < decisions.length; ++index) {
    decision = decisions[index];
    if (decision.type == "decision") {
      log = decision_to_text(get_atom_from_lit(decision.lit)) + "..\n" + log;
    }
  }
  updateLog();
}

function need_to_update_graphics() {
  return true;
}

function toggle_configuration() {
  content = document.getElementById("configuration");
  if (content.style.display === "block") {
    content.style.display = "none";
  } else {
    content.style.display = "block";
  }
  button = document.getElementById("configuration-toggle");
  button.innerHTML = button.innerHTML.replace("▸", "▿");
  button.innerHTML = button.innerHTML.replace("▾", "▸");
  button.innerHTML = button.innerHTML.replace("▿", "▾");
}

clearLog();
write_decisions_to_log();

sudoku_initialize_board();
sudoku_render_board();
board_blocked = false;
load_example_from_path("examples/basic.lp");
