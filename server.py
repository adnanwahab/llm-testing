from __future__ import unicode_literals

import os

from flask import Flask, render_template, jsonify, redirect, url_for, request, send_from_directory

from flask_cors import CORS
import sqlite3

import pypdb
from Bio.Blast import NCBIWWW

import urllib
import urllib.parse
import urllib.request
from bs4 import BeautifulSoup

#perfect programming
#human has 50 trillion cells
#human has 50 protein million molecules per cell
#proteins have average of 1500 atoms 
#20,000 proteins types in a human

#corn is solved https://www.maizegdb.org/

fname=  'F1maize.FINAL.fasta'
def get_uniprot (query='',query_type='PDB_ID'):
    #code found at <a href="https://chem-workflows.com/articles/2019/10/29/retrieve-uniprot-data-using-python/">https://chem-workflows.com/articles/2019/10/29/retrieve-uniprot-data-using-python/</a>
    #query_type must be: "PDB_ID" or "ACC"
    url = 'https://www.uniprot.org/uploadlists/' #This is the webser to retrieve the Uniprot data
    params = {
    'from':query_type,
    'to':'ACC',
    'format':'txt',
    'query':query
    }
    data = urllib.parse.urlencode(params)
    data = data.encode('ascii')
    request = urllib.request.Request(url, data)
    with urllib.request.urlopen(request) as response:
        res = response.read()
        page=BeautifulSoup(res).get_text()
        page=page.splitlines()
    return page
    pdb_code = '4FXF'
    query_output=get_uniprot(query=pdb_code,query_type='PDB_ID')
    accession_number = query_output[1].strip().split(' ')[-1].strip(';')

from Bio import SeqIO
#pypdb
#flask_cors
#https://www.tutorialspoint.com/biopython/biopython_overview_of_blast.htm
def fasta_dna_to_protein_file(filename):
    seq_record = next(SeqIO.parse(open(filename),'fasta')) 
    print('seq_record')

    result_handle = NCBIWWW.qblast("blastn", "nt", seq_record.seq) 
    print(result_handle) 

    with open('results.xml', 'w') as save_file: 
        blast_results = result_handle.read() 
        save_file.write(blast_results)
print('running fasta')

fasta_dna_to_protein_file(fname)
print('exiting')
exit()
print('exitin 2g')

knownInteractions = {}
#go to the lab
#given a protein on af
#get gene
#gene entire genome
#perform sgrna substitution
#simulate effects of gene on organism -> custom for each gene as of now 
#simualate behavior of gene [done]
# get pdb -> simulate behavior and interactions -> give readout of 
# get pdb
# get gene
# replace gene in fasta using gene
# get new protein ???
# run alphafold on fasta to get new protein 
# simulate new protein and previous protein and diff the behavior 
# that gives you the results to tell user to see if it works
# simulate as much shit as possible
# http://plantcrispr.org/cgi-bin/crispr/index.cgi
# find a fasta 
# find selected gene - ideally list all genes that are possible to edit
# find all possible ways to edit a genome using crispr
# once gene is edited
# get protein produced by gene

#super easy to use and automated workflows and simulated experiments for algae people - correct
#expediency = best 
#compelte application today
def getAllChemicalInteractions(fasta):
    chemicalInteractions = []
    for seq in fasta:
        if (seq in knownInteractions):
            chemicalInteractions.append(knownInteractions[seq])
    return chemicalInteractions

app = Flask(__name__)
def get_db_connection():
    conn = sqlite3.connect('database.db')
    conn.row_factory = sqlite3.Row
    return conn

# @app.route('/gene-editing')
# def lyrics():
#     data = {}
#     found_pdbs = pypdb.Query("algae").search()

#     data['genesToEdit'] = {
#         'name': 'go:123', 
#         'effects': 'this adds glowing to a tree',
#         'genesToEdit': found_pdbs
#         }
#     return jsonify(data)

from flask import Flask, Response
import time
import json
from openmm.app import *
from openmm import *
from openmm.unit import *
#nnluz (luciferase), nnhisps (hispidin synthase), nnh3h (hispidin-3-hydroxylase), and nncph (caffeoyl pyruvate hydrolase)
#https://www.pnas.org/doi/suppl/10.1073/pnas.1803615115
#https://www.ncbi.nlm.nih.gov/pmc/articles/PMC7610436/
first_glowing_genes_attempt = [
    'nnluz',
    'nnhisps', 
    'nnh3h',
    'nncph'
]
#first
def helloWorld():
    print('Loading...')
    #create custom PDB from fasta edit 
    pdb = PDBFile('./data_sets/AF-A0A2W7I3V2-F1-model_v4.pdb')
    forcefield = ForceField('amber99sb.xml', 'tip3p.xml')
    modeller = Modeller(pdb.topology, pdb.positions)
    print('Adding hydrogens...')
    modeller.addHydrogens(forcefield)
    print('Adding solvent...')
    modeller.addSolvent(forcefield, model='tip3p', padding=1*nanometer)
    print('Minimizing...')
    system = forcefield.createSystem(modeller.topology, nonbondedMethod=PME)
    integrator = VerletIntegrator(0.001*picoseconds)
    simulation = Simulation(modeller.topology, system, integrator)
    simulation.context.setPositions(modeller.positions)
    simulation.minimizeEnergy(maxIterations=1)
    print('Saving...')
    positions = simulation.context.getState(getPositions=True).getPositions()
    PDBFile.writeFile(simulation.topology, positions, open('output.pdb', 'w'))
    print('Done', simulation.topology)
    return simulation.topology

app = Flask(__name__)
@app.route('/gene-editing')
def gene_editing():
    workflow = req.params.seq

    def simulate_and_stream():
        content_length = 1e6
        for i in range(10):
            # Simulate some gene-editing computation here
            time.sleep(1)
            helloWorld()
            # Generate JSON payload (could be the current state of the simulation)
            simulation_data = {
                "iteration": i,
                "status": "in_progress",
                "data": [i, i + 1, i + 2]
            }
            
            payload = json.dumps(simulation_data)
            payload_length = len(payload)
            content_length += payload_length
            
            yield payload

        # Sending final state
        simulation_data = {
            "iteration": 10,
            "status": "completed",
            "data": []
        }
        yield json.dumps(simulation_data)
        
    # Set the headers, including 'Content-Length' and 'Content-Type'
    headers = {
        'Content-Type': 'application/octet-stream',
        'Transfer-Encoding': 'chunked',
    }

    return Response(simulate_and_stream(), headers=headers)

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

@app.route('/alignment-editing')
def seeHowDNAEditsChangeThealignmentsOfTheGenome():
    seq = req.params.seq
    index = req.params.index
    
    data = {
        'alignment': 'gataccat',
        'index': index,
        'seq': seq
    }
    runGenomeSequencingAlgorithm(data)
    return data

def runGenomeSequencingAlgorithm(data):
    seq = data['seq']
    l = len(seq)
    for i in range(l):
        for j in range(l):
            seq[i] = seq[j]
    return data
#edit genome -> see how the updated 3d structure affects how it changes how it runs within the cell
#what other types of agents are there in a cell
#mitochrondria, ribosomes, sgRNA 
#hardcode nucleus
Organelle_Types = [
    'ribosome', 'mitochondria', ''
]
#use an octree for spatial acceleration lookups
#use numpy for faster vector math

#simulate 5 different systems in cell
#using machine learning to initialize the state of a cell so that it matches various states captured in single cell analysis 
#about 100 studies -> 5000-100,000 cell states in each one
#match the tissue and cell type
	#1500 ribosomes
	#70% cytoplasm
	#represent as 1 million agents = organelles and have them collide and interact with each other 
	#each collision may change the state of each agent 
#simulate experiments so that biologists dont have to run as many
#export procedures for robots and humans to exectute in the lab
class Organelle:
    def __init__(self, coords=[0,0,0], dir=[0,0,0]):
        self.coords = [0,0,0]
        self.dir = [0,0,0]
        self.type = 0
        #what states are there in an organelle 

    def step():
        self.coords[0] = self.coords[0] + self.dir[0]
        self.coords[1] = self.coords[1] + self.dir[1]
        self.coords[2] = self.coords[2] + self.dir[2]

    def interaction ():
        if collison(self.pos, self.neighbors):
            self.dir[0]


import random
def simulateCellChanges():
    agents = []

    for i in range(1e6):
        type = i % 5
        agents.append(Organelle(type, [i % 2, i % 3, i% 4], [i % 2, i% 2, i% 3])
        )

    iterations = 0
    while (iterations < 5000):
        iterations += 1
        for agent in agents: agent.step() 


class ExperimentModel:
    def __init__(self):
        self.steps = []
        self.parameters = None
    def step(self):
        return 1

def simulateExperiments(parameters):
    model = ExperimentModel()
    model.parameters = parameters
    model.step()

#https://www.frontiersin.org/articles/10.3389/fchem.2023.1106495/full

@route('/proteinomics')
def solveProblem():
    fasta = req.params.fasta
    import alphaFold
    alphaFold.run('./fasta')
    return 



def solveTheProblem():
    #go in person to every lab in the nation and talk to every biologist and find out software they use and come up with new workflows that they couldnt do before with new tools that they didnt have before 
    #   for each biologist(blueBiotech/greenBiotech) in the nation:
            # talk to each one in person
            #get a list of problems
            #get a list of things they do
            #find a new way of doing specific tasks they have
            #convert each problem into a list of requirements 
            #convert each list of requirements into a list of tasks
            #solve each task one by one
            #return working product
            #return to step 1
    return 1

def findWalgreens():
    data = request('http://api.yelp.com/?&longitude=${longtiude}&latitude=${latitude}')
    print(data)     

#edit the PDB directly according to what the fasta file says 

"send me a tree that has purple branches and so on"

#me = {} -> send request to nameServer which dispatches a route from cvs to postoffice












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