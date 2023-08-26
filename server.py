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
#https://www.ncbi.nlm.nih.gov/genbank/fastaformat/
#perfect programming
#human has 50 trillion cells
#human has 50 protein million molecules per cell
#proteins have average of 1500 atoms 
#20,000 proteins types in a human
#what is the overlap between the reference sequence and the existing sequences of the target nucleus

#corn is solved https://www.maizegdb.org/
#https://algae.biocyc.org/gene-search.shtm
#https://mycocosm.jgi.doe.gov/cgi-bin/ToGo?accession=GO:0008150&species=Astpho2
#https://www.ncbi.nlm.nih.gov/pmc/articles/PMC2863401/
#https://www.sciencedirect.com/science/article/abs/pii/S2211926423001017
#https://www.nature.com/articles/srep24951

#Phaeodactylum tricornutum
#https://www.cell.com/molecular-plant/pdf/S1674-2052(18)30250-8.pdf
#CpSRP54 is both a gene and a prtein? 
#https://escholarship.org/uc/item/3xz420hv


#add this gene to another algae so it has more photosynthesis ?

# >sp|P37107|SR54C_ARATH Signal recognition particle subunit SRP54, chloroplastic OS=Arabidopsis thaliana OX=3702 GN=FFC PE=1 SV=1
# MEALQFSSVNRVPCTLSCTGNRRIKAAFSSAFTGGTINSASLSSSRNLSTREIWSWVKSK
# TVVGHGRYRRSQVRAEMFGQLTGGLEAAWSKLKGEEVLTKDNIAEPMRDIRRALLEADVS
# LPVVRRFVQSVSDQAVGMGVIRGVKPDQQLVKIVHDELVKLMGGEVSELQFAKSGPTVIL
# LAGLQGVGKTTVCAKLACYLKKQGKSCMLIAGDVYRPAAIDQLVILGEQVGVPVYTAGTD
# VKPADIAKQGLKEAKKNNVDVVIMDTAGRLQIDKGMMDELKDVKKFLNPTEVLLVVDAMT
# GQEAAALVTTFNVEIGITGAILTKLDGDSRGGAALSVKEVSGKPIKLVGRGERMEDLEPF
# YPDRMAGRILGMGDVLSFVEKATEVMRQEDAEDLQKKIMSAKFDFNDFLKQTRAVAKMGS
# MTRVLGMIPGMGKVSPAQIREAEKNLLVMEAMIEVMTPEERERPELLAESPERRKRIAKD
# SGKTEQQVSALVAQIFQMRVKMKNLMGVMEGGSIPALSGLEDALKAEQKAPPGTARRKRK
# ADSRKKFVESASSKPGPRGFGSGN
#convert above gene to nucleotide sequence -> append to existing fasta
#convert that to an sg-rna for sequenced organism
#https://www.uniprot.org/uniprotkb/P37107/entry
#get fasta file
#get gene file
#get protein of expressed gene
#finale: so that this gene can be edited and the expressed protein changes
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
#protein updates involve which things in a cell - enzymes - especially for glowing and most of the things ?
#glowing plant = 

#just use a csv
#@route


os.shell

execAF = '''python3 docker/run_docker.py \
  --fasta_paths=monomer.fasta \
  --max_template_date=2021-11-01 \
  --model_preset=monomer \
  --data_dir=$DOWNLOAD_DIR \
  --output_dir=/home/user/absolute_path_to_the_output_dir'''


# Importing required module
import subprocess
 
# Using system() method to
# execute shell commands
subprocess.Popen(execAF, shell=True)


def runAF():
    run_relax = True  #@param {type:"boolean"}
    relax_use_gpu = False  #@param {type:"boolean"}
    multimer_model_max_num_recycles = 3  #@param {type:"integer"}
# --- Run the model ---
    if model_type_to_use == ModelType.MONOMER:
    model_names = config.MODEL_PRESETS['monomer'] + ('model_2_ptm',)
    elif model_type_to_use == ModelType.MULTIMER:
    model_names = config.MODEL_PRESETS['multimer']

    output_dir = 'prediction'
    os.makedirs(output_dir, exist_ok=True)

    plddts = {}
    ranking_confidences = {}
    pae_outputs = {}
    unrelaxed_proteins = {}

    for model_name in model_names:
        cfg = config.model_config(model_name)
        if model_type_to_use == ModelType.MONOMER: cfg.data.eval.num_ensemble = 1
        elif model_type_to_use == ModelType.MULTIMER: cfg.model.num_ensemble_eval = 1

        if model_type_to_use == ModelType.MULTIMER:
            cfg.model.num_recycle = multimer_model_max_num_recycles
            cfg.model.recycle_early_stop_tolerance = 0.5

        params = data.get_model_haiku_params(model_name, './alphafold/data')
        model_runner = model.RunModel(cfg, params)
        processed_feature_dict = model_runner.process_features(np_example, random_seed=0)
        prediction = model_runner.predict(processed_feature_dict, random_seed=random.randrange(sys.maxsize))

        mean_plddt = prediction['plddt'].mean()

        if model_type_to_use == ModelType.MONOMER:
            if 'predicted_aligned_error' in prediction:
                pae_outputs[model_name] = (prediction['predicted_aligned_error'],
                                            prediction['max_predicted_aligned_error'])
            else:
                ranking_confidences[model_name] = prediction['ranking_confidence']
                plddts[model_name] = prediction['plddt']
        elif model_type_to_use == ModelType.MULTIMER:
            ranking_confidences[model_name] = prediction['ranking_confidence']
            plddts[model_name] = prediction['plddt']
            pae_outputs[model_name] = (prediction['predicted_aligned_error'],
                                        prediction['max_predicted_aligned_error'])
        final_atom_mask = prediction['structure_module']['final_atom_mask']
        b_factors = prediction['plddt'][:, None] * final_atom_mask
        unrelaxed_protein = protein.from_prediction(
            processed_feature_dict,
            prediction,
            b_factors=b_factors,
            remove_leading_feature_dimension=(
                model_type_to_use == ModelType.MONOMER))
        unrelaxed_proteins[model_name] = unrelaxed_protein
        del model_runner
        del params
        del prediction
        best_model_name = max(ranking_confidences.keys(), key=lambda x: ranking_confidences[x])

    if run_relax:
        amber_relaxer = relax.AmberRelaxation(
            max_iterations=0,
            tolerance=2.39,
            stiffness=10.0,
            exclude_residues=[],
            max_outer_iterations=3,
            use_gpu=relax_use_gpu)
        relaxed_pdb, _, _ = amber_relaxer.process(prot=unrelaxed_proteins[best_model_name])
    else:
        print('Warning: Running without the relaxation stage.')
        relaxed_pdb = protein.to_pdb(unrelaxed_proteins[best_model_name])

    # Construct multiclass b-factors to indicate confidence bands
    # 0=very low, 1=low, 2=confident, 3=very high
    banded_b_factors = []
    for plddt in plddts[best_model_name]:
        for idx, (min_val, max_val, _) in enumerate(PLDDT_BANDS):
            if plddt >= min_val and plddt <= max_val: banded_b_factors.append(idx)
            break
    banded_b_factors = np.array(banded_b_factors)[:, None] * final_atom_mask
    to_visualize_pdb = utils.overwrite_b_factors(relaxed_pdb, banded_b_factors)

    pred_output_path = os.path.join(output_dir, 'selected_prediction.pdb')
    with open(pred_output_path, 'w') as f: f.write(relaxed_pdb)
    show_sidechains = True
    print('done')
# def plot_plddt_legend():
#   """Plots the legend for pLDDT."""
#   thresh = ['Very low (pLDDT < 50)',
#             'Low (70 > pLDDT > 50)',
#             'Confident (90 > pLDDT > 70)',
#             'Very high (pLDDT > 90)']

#   colors = [x[2] for x in PLDDT_BANDS]

#   plt.figure(figsize=(2, 2))
#   for c in colors:
#     plt.bar(0, 0, color=c)
#   plt.legend(thresh, frameon=False, loc='center', fontsize=20)
#   plt.xticks([])
#   plt.yticks([])
#   ax = plt.gca()
#   ax.spines['right'].set_visible(False)
#   ax.spines['top'].set_visible(False)
#   ax.spines['left'].set_visible(False)
#   ax.spines['bottom'].set_visible(False)
#   plt.title('Model Confidence', fontsize=20, pad=20)
#   return plt

# Show the structure coloured by chain if the multimer model has been used.
if model_type_to_use == ModelType.MULTIMER:
  multichain_view = py3Dmol.view(width=800, height=600)
  multichain_view.addModelsAsFrames(to_visualize_pdb)
  multichain_style = {'cartoon': {'colorscheme': 'chain'}}
  multichain_view.setStyle({'model': -1}, multichain_style)
  multichain_view.zoomTo()
  multichain_view.show()

# Color the structure by per-residue pLDDT
color_map = {i: bands[2] for i, bands in enumerate(PLDDT_BANDS)}
#view = py3Dmol.view(width=800, height=600)
#view.addModelsAsFrames(to_visualize_pdb)
style = {'cartoon': {'colorscheme': {'prop': 'b', 'map': color_map}}}
if show_sidechains:
  style['stick'] = {}
#view.setStyle({'model': -1}, style)
#view.zoomTo()

grid = GridspecLayout(1, 2)
out = Output()
with out:
  view.show()
grid[0, 0] = out

out = Output()
with out:
  plot_plddt_legend().show()
grid[0, 1] = out

#display.display(grid)

# Display pLDDT and predicted aligned error (if output by the model).
# if pae_outputs:
#   num_plots = 2
# else:
#   num_plots = 1

# plt.figure(figsize=[8 * num_plots, 6])
# plt.subplot(1, num_plots, 1)
# plt.plot(plddts[best_model_name])
# plt.title('Predicted LDDT')
# plt.xlabel('Residue')
# plt.ylabel('pLDDT')

# if num_plots == 2:
#   plt.subplot(1, 2, 2)
#   pae, max_pae = list(pae_outputs.values())[0]
#   plt.imshow(pae, vmin=0., vmax=max_pae, cmap='Greens_r')
#   plt.colorbar(fraction=0.046, pad=0.04)

#   # Display lines at chain boundaries.
#   best_unrelaxed_prot = unrelaxed_proteins[best_model_name]
#   total_num_res = best_unrelaxed_prot.residue_index.shape[-1]
#   chain_ids = best_unrelaxed_prot.chain_index
#   for chain_boundary in np.nonzero(chain_ids[:-1] - chain_ids[1:]):
#     if chain_boundary.size:
#       plt.plot([0, total_num_res], [chain_boundary, chain_boundary], color='red')
#       plt.plot([chain_boundary, chain_boundary], [0, total_num_res], color='red')

#   plt.title('Predicted Aligned Error')
#   plt.xlabel('Scored residue')
#   plt.ylabel('Aligned residue')

# Save the predicted aligned error (if it exists).
pae_output_path = os.path.join(output_dir, 'predicted_aligned_error.json')
if pae_outputs:
  # Save predicted aligned error in the same format as the AF EMBL DB.
  pae_data = confidence.pae_json(pae=pae, max_pae=max_pae.item())
  with open(pae_output_path, 'w') as f:
    f.write(pae_data)

def difference(one, two):
    return [item for item in one if item in two]

def readFasta(filename):
    return SeqIO.parse(open(filename),'fasta')

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

def runSimulations(first, second):
    result1 = simulateMolecularDynamics(first)
    result2 = simulateMolecularDynamics(second)
    return difference(result1, result2)

def alphaFold():
    return 123

def applyEditToGenome(entireGenome, updatedGene):
    return 

def applyEditToGene(gene, before, edit):
    idx = -1
    for seq in gene:
        idx+= 1
        if before in seq:
            break
    return idx #gene.replace(before, edit)


#how to propose a gene edit
#use a prompt
#use a menu
#use a contentEditable textarea (nope)
def edit_Gene_Get_New_Protein_And_Diff_TheResults(organism, gene, before, edit):
    #dont need the proteins -> just use the genes ??
    entireGenome = readFasta(organism) #200mb -> just a generator
    geneToEdit = readFasta(gene)
    protein_name = 'CpSRP54.fna'
    first_protein = readFasta(protein_name) #read PDB or run AF
    #sql.query('select prot from protein where gene_name = (?)', gene)
    
    updatedGene = applyEditToGene(geneToEdit, before, edit)
    updatedGenome = applyEditToGenome(entireGenome, geneToEdit, updatedGene) # display this

    updatedProtein = runAF(updatedGene)
    effects = runSimulations(first_protein, updatedProtein)

    return jsonify([updatedProtein, updatedGenome, effects])

#pypdb
#flask_cors
#https://www.tutorialspoint.com/biopython/biopython_overview_of_blast.htm
#https://blast.ncbi.nlm.nih.gov/Blast.cgi?PAGE=Nucleotides&PROGRAM=blastn&QUERY=NC_003076.8&DATABASE=nr&MEGABLAST=on&BLAST_PROGRAMS=megaBlast&LINK_LOC=nuccore&PAGE_TYPE=BlastSearch&QUERY_FROM=1060106&QUERY_TO=1063425    
#https://www.ncbi.nlm.nih.gov/datasets/taxonomy/3702/
#https://api.ncbi.nlm.nih.gov/datasets/v2alpha/genome/download?filename=ncbi_dataset.zip&ncbi_phid=939B3D945261CB95000055F0642CA36E.1.m_1.021
def fasta_dna_to_protein_file(filename):
    seq_record = next(SeqIO.parse(open(filename),'fasta')) 
    print('seq_record')

    result_handle = NCBIWWW.qblast("blastn", "nt", seq_record.seq) 
    print(result_handle) 

    with open('results.xml', 'w') as save_file: 
        blast_results = result_handle.read() 
        save_file.write(blast_results)
print('running fasta')
fname = 'gene.fna'
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





