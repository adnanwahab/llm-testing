from __future__ import unicode_literals

import os

from flask import Flask, render_template, jsonify, redirect, url_for, request, send_from_directory
#https://www.digitalocean.com/community/tutorials/how-to-use-an-sqlite-database-in-a-flask-application
import openai
from langchain.llms import OpenAI
from langchain.prompts import PromptTemplate
import yt_dlp
from transcribe import transcribe

from flask_cors import CORS
import sqlite3

def get_db_connection():
    conn = sqlite3.connect('database.db')
    conn.row_factory = sqlite3.Row
    return conn

@app.route('/lyrics.json')
def lyrics():
    path = '/home/awahab/llm-testing/static/'
    filename = "lyrics.json"
    print('hello world')
    return send_from_directory(path, filename, as_attachment=True)

app = Flask(__name__)
CORS(app)
if __name__ == "__main__":
    print('hello')
    app.run(debug=True)


#get list of viable edits online 
def get_genome():
    return ''

def modelMolecularChanges(fasta, seq, index):
    fasta[seq][index] = get_genome()


def pdb_to_fasta(pdb):
    assert 4 == 4
    pass

def fasta_to_pdb(fasta):
    pass

def editGenome(pdb, seq, index):
    fasta = pdb_to_fasta(pdb)

    fasta = modelMolecularChanges(fasta, seq, index)

    pdb = fasta_to_pdb(fasta)

    return pdb

class ForceReporter(object):
    def __init__(self, file, reportInterval):
        self._out = open(file, 'w')
        self._reportInterval = reportInterval

    def __del__(self):
        self._out.close()

    def describeNextReport(self, simulation):
        steps = self._reportInterval - simulation.currentStep%self._reportInterval
        return (steps, False, False, True, False, None)

    def report(self, simulation, state):
        forces = state.getForces().value_in_unit(kilojoules/mole/nanometer)
        for f in forces:
            self._out.write('%g %g %g\n' % (f[0], f[1], f[2]))

def simulateMolecularDynamics():
    system = forcefield.createSystem(pdb.topology, nonbondedMethod=CutoffNonPeriodic,
    nonbondedCutoff=1*nanometer, constraints=None)
    force = CustomExternalForce('100*max(0, r-2)^2; r=sqrt(x*x+y*y+z*z)')
    system.addForce(force)
    for i in range(system.getNumParticles()):
        force.addParticle(i, [])
    integrator = LangevinMiddleIntegrator(300*kelvin, 91/picosecond, 0.004*picoseconds)
    import os
    for file in os.listdir('structures'):
        pdb = PDBFile(os.path.join('structures', file))
        simulation.context.setPositions(pdb.positions)
        state = simulation.context.getState(getEnergy=True)
        print(file, state.getPotentialEnergy())

#https://openstructure.org/docs/2.5/seq/base/seq/