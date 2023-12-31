#./build_sgrna_library.py --input_genbank_genome_name testdata/U00096.3_full_sequence.gb
#https://github.com/traeki/sgrna_design
#Do Trait Modeling - do this one
#Do crispr design + verification 





#simulate every atom and every chemical process in a cell
#use SCA to inform simulation -> 
#query simulation by SCA -> outputs h5+h5ad

# figure it out w/o molecules
#gene ontology - tomorrow = get approximate "trait" or phentoype or what gene does 
# https://nyu-cds.github.io/python-numba/05-cuda/
# https://analyticsindiamag.com/scientists-use-nvidia-gpu-to-mimic-living-cell/#:~:text=NVIDIA%20GPUs%20were%20replicating%20around,them%20easier%20to%20recreate%20digitally.


#use cell simulations to predict edits to genes result in better photosynthesis
#cant do it randomly
#a gene has 3000 base pairs - 3 million
#create gene combinations that nature never would have and simulate them
#render results of the simulation in webgpu

#make it so the server ships in a docker container and you can run from steam or git clone 


#simulate photosythesis to determine which genes to edit
#dont use prebaked genes from other organisms ->
#create new genes from scratch to create new chemical reaction cycles like calvin cycle that nature would
#not have thought of


#look at all crispr studies -> run




#https://newatlas.com/crispr-flower-change-color/51276/#:~:text=Hitching%20a%20ride%20on%20a,usual%20violet%20flowers%20and%20stems.

#https://www.ncbi.nlm.nih.gov/genbank/fastaformat/
#perfect programming - 25 - august 
# "send me a tree that has purple branches and so on"
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

#protein interaction network
#metabolome network
#cell interaction network
#transcriptome =
# to finish this app - first step = talk to 10-100 domain experts - 5 per day - get lists of requiremnets
#eta till v1 = 1 week


#desired traits to add / emphasize = diseease resistnace, immunity to cold/heat, and increased yield of biofuels and reduced methane
#current genes, possible genes, and proposed gene edits
#that becomes a target genome which you use to generate SGRNA
#selected possible genes = 20 => generates l;ist of proposed gene edits => SGRNA 
#sent to lab, add to cart, send to home, and generate lab instruction procedure


#difference between previous proteins, cell-behavior and tissue behavior, organism behavior -> effect on ecosystem/enviornment
#



#given a number of proposed gene edits
#addition = substitue for unused genes
#subtraction = substitute used genes for fillers
#edit = subsittue used gene for another used gene

from __future__ import unicode_literals
import os

from flask import Flask, render_template, jsonify, redirect, url_for, request, send_from_directory
app = Flask(__name__)
from flask_cors import CORS
import sqlite3

import pypdb
from Bio.Blast import NCBIWWW

import urllib
import urllib.parse
import urllib.request
from bs4 import BeautifulSoup

fname = 'F1maize.FINAL.fasta'
from Bio import SeqIO
from BCBio.GFF import GFFExaminer
import re
from collections import defaultdict
open_ai_key = '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'
import glob
from Bio import SeqIO
import requests

#glowing is 6 genes
#add the glowing phenotype to algae
#all glowing to popcorn
from PyPDF2 import PdfReader
import openai


import requests
from bs4 import BeautifulSoup


import random
#https://genomebiology.biomedcentral.com/articles/10.1186/s13059-020-02204-y
#once you simulate the calvin cycle
#can simulate or create new photosynthesis reactions from "scratch" -> may have different outputs
#todo holographics -> design molecules in

#https://github.com/GollyGang/ready/blob/gh-pages/Scripts/Python/convolve.py
#simulate atoms in cell

#simulate tissues + communication between cells

#simulate ecosystem -> https://tristansalles.github.io/EnviReef/welcome.html

def get_uniprot_info(uniprot_id):
    url = f"https://www.uniprot.org/uniprot/{uniprot_id}.xml"
    response = requests.get(url)
    if response.status_code != 200:
        print(f"Failed to retrieve data for {uniprot_id}")
        return

    soup = BeautifulSoup(response.content, 'xml')
    molecular_functions = []
    gene_ontology = []

    for entry in soup.find_all('entry'):
        for dbReference in entry.find_all('dbReference', {'type': 'GO'}):
            go_info = dbReference.find('property', {'type': 'term'}).get('value')
            go_id = dbReference.get('id')
            if go_info.startswith('F:'):
                molecular_functions.append((go_id, go_info[2:]))
            elif go_info.startswith('P:') or go_info.startswith('C:'):
                gene_ontology.append((go_id, go_info[2:]))

    return molecular_functions, gene_ontology


def getTraits():
    #given a genome -> genes
    #look up every gene in ncbii -> uniprot -> find ones with GO + molecular function
    #get list of all genes downloaded to archive
    #look them up in uniprot
    #build a graph out of the GO
    #list of molecular functiosn = traits
    uniprot_id = "IPR005969"  # Replace with your UniProt ID of interest
    molecular_functions, gene_ontology = get_uniprot_info(uniprot_id)
    
    print("Molecular Functions:")
    for go_id, function in molecular_functions:
        print(f"{go_id}: {function}")

    print("\nGene Ontology:")
    for go_id, go_term in gene_ontology:
         print(f"{go_id}: {go_term}")
    return print(molecular_functions)
#getTraits()

def generate_text(prompt):
    openai.api_key = open_ai_key

    # list models
    models = openai.Model.list()

    # print the first model's id
    print(models.data[0].id)

    # create a chat completion
    chat_completion = openai.ChatCompletion.create(model="gpt-3.5-turbo",
                                                   messages=[{"role": "user", "content": prompt}])

    #use fineTuning to read all papers in computational biolgoy + algae + create datasets like 
    # print the chat completion
    print(chat_completion.choices[0].message.content)

def processPrompt():
    paper = './data_sets/s41588-022-01052-9.pdf'
    reader = PdfReader(paper)
    number_of_pages = len(reader.pages)
    page = reader.pages[0]
    text = page.extract_text()
    #print(text)
    prompt = f"given all this text {text}, list all genes that are mentioned"
    generated_text = generate_text(prompt)
    print(generated_text)

def listOfGenesThatAreActive():
    intron = 'T'
    exon = 'A'
    gff = 'Astgub1_GeneCatalog_genes_20230516.gff'
    f = '/home/awahab/llm-testing/data_sets/Astgub1/'
    fasta = 'Astgub1_AssemblyScaffolds_Repeatmasked.fasta'
    in_file = f + gff
    examiner = GFFExaminer()
    in_handle = open(in_file)
    lines = []
    with open(f + gff) as file:
        lines += file.read().split('\n')
        tabsOut = [line.split('\t') for line in lines]
    exons = [row for i, row in enumerate(tabsOut) if len(row) > 1 and row[2] == 'exon']
    
    geneIds = defaultdict(list)
    exon_start_ends = {}

    for i in exons: 
        start = int(i[3])
        end = int(i[4])
        geneId = i[8]
        geneId = re.search(r'name "([^"]+)"', geneId)[1]
        geneIds[geneId].append([start, end])
        exon_start_ends[start] = end
    return geneIds

def findGenesFromDisk(f):
    #f = all_fna[0]
    descp = next(SeqIO.parse(f, 'fasta')).description
    return descp
    #return re.search(r'name "([^"]+)"', descp)[1]

def listOf300Genes():
    all_fna = glob.glob('./archive/*/ncbi_dataset/data/rna.fna')
    return [findGenesFromDisk(f) for f in all_fna]

@app.route('/getPhenotypeNetwork')
def phenotypeNetwork():
    #determine which phenotypes belong to which species
    phenotypes = {
        #determine which traits complement each other
        #rules = if more than 20 genes activated - no can do
        #if over lapping genes, place genes twice
	  'Increased PhotoSynthesis': ['GFR39584.1', 'GFR39584.2', 'GFR39584.3'],
	  'Immunity to Frost': ['GFR32184.1', 'GFR341584.2', 'GFR49584.3'],
	  'Immunity to Disease': ['GFR32131.1', 'GFR341521.2', 'GFR49584.3'],
	  'Increased BioFuel Yield': ['GFR32134.1', 'GFR341521.2', 'GFR49521.3'],
    }
    print('phenotypeNetwork')
    return jsonify(phenotypes)

#piano player who wants to be mute
@app.route('/simulateStepsOfCrispr')
def simulateStepsOfCrispr():
    #simulate what happens when crispr molecule interacts with DNA molecule
    #how does it cut the dna in the chromatin
    #how many cells does it affect
    s = SeqIO.parse('./maize.fasta', 'fasta')
    seq = next(s).seq
    
    #run basic local alignment search tool
    #get list of gene coordinates
    #return list of gene coordinates to browser -> assign each coordiante to a gene to splice

    #98% of genome is not expressed -> use this to splice genes
    start_codon = 'ATG'
    end_codons = ['TTG', 'CTC', 'GGA']
    for seq in s:
        applyEditedRNAToDNA(seq)
        s = seq.seq
        print(len(s))
        openReferenceFrames = []
        for idx, char in enumerate(s):
            window = s[idx:idx+3]
            if window == start_codon:
                for idx2, char2 in enumerate(s[idx:]):
                    window2 = s[idx2:idx+3]
                    if window2 in end_codons:
                        start = idx
                        end = idx2
                        openReferenceFrames.append((start, end ))
    print(openReferenceFrames)
    CRISPR_COPY = 123
    a = f'asdf {asdfasdasdfi}'
    SeqIO.write(f'maize{CRISPR_COPY}.fasta')

    #approximately 8 introns and exons
    #len = end - start
    #exonLength = math.floor(len / 16)

    intronsAndExons = [seq[exonLength*i:exonLength*i+1] for i in range(exonLength - 1)]
    introns = [intron for i, intron in enumerate(intronsAndExons) if i % 2 == 0]
    exons = [exon for i, exon in enumerate(intronsAndExons) if i % 2 == 1]
    introns = intronsAndExons[1::2]
    exons = intronsAndExons[0::2]
    
    #splice
    #new genes - replace with previous ones => simulate effects - substitue
    #splice new genes by replacing unused data with new gene - adddition
    #can crispr delete genes ???? 
    return openReferenceFrames

#simulateStepsOfCrispr()

@app.route('/currentlyActiveGenes')
def organismGetGenes():
    return jsonify(listOfGenesThatAreActive())

@app.route('/possibleGeneEdits')
def getListOfGenesThatCanBeSpliced():
    return jsonify(listOf300Genes())

@app.route('/spliceGeneByPrototypingSGRNA')
def spliceGeneWithSGRNA():
    sgrna = ''
    return sgrna

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


def proteinomics():
    #for gene in changedGene:
    lines =[]
    'ATOM      1  N   MET A   1      -8.016  15.868  15.250  1.00 62.44           N  '
    with open('./data_sets/_.pdb') as pdb:
        for line in pdb:
            line = line.split(' ')
    #simulate chemical reactions within cell
    #diff output of simulation before and after gene edits
            #type = atom, index = n, Met=, xyz element = z
            
def getPhenoTypesComputationally():
    #probably n genes
    #may not be a problem that can be yet solved in this way, requires direct observation and experiment?
    #look up more papers and find out if there is a way to do this with code
    geneExpression = 123
    if geneExpression == 'increased melanin in iris':
        return ['brown color in eyes']
    #TODO talk to biologists and find out what exactly they do to determine which genes to tweak and then get the desired result to publih a paper on


def geneInteractionSimulation():
    return 123
def userFriendlyINterfaceThatGuidesUsersThroughCrisprcas9experiments():
    #suggest target dequences, design pimers and predict potential off target effects
    return 123

def virtualLabEnvironment():
    return 123 #virtual cells, reagents, equipment -> allow users

#integrate databases of gene annotations such as functional information, pathways and related disesase

#add persistence so all users can edit genomes on one canvas
#use a discussionboard to have users collaboratively propose gene editing features

def extractPhenoTypeAndGeneticDependenciesFromPaper():
    phenotypes = []
    for paper in os.listdir('./papers'):
        text = getText(paper)
        results = gpt.request('get me all the phenotype/trait->genes in the format phenotype:[genes], ')
        phenotypes.append(results)
    return phenotypes
def proposeSgrnaFromGeneEdits(edits):
    #list of edits
    edits = [
        {'type': 'addition', 'seqData': 'asdfas',
         },
        {'type': 'subtraction', 'targetSeqData': 'asdf',
         'targetSeqIndex': 1
         },
        {'type': 'substitution', 'targetSeqIndex': '1',
         'originalSeqData': 'cat',
         'targetSeqData': 'ccc',
         'geneName': 'atpA'
         }
    ]
    mrna = 'gatactactata'[::-1]
    for edit in edits: 
      if type == 'substituion':
        gatacaa[edit['targetSeqIndex']] = edit['targetSeqData']
      if type == 'addition':
        idx = findFirstIndex(mrna, len(edit['seqData']))
        mrna[idx] = edit['seqData']
      if type == 'subtract':
        mrna[edit['targetSeqIndex']] = 'T' * len(edit['targetSeqData'])
    #consider introns + exonsfff
    #consider how different gene placements affect the expression of said gene
    return mrna

def runTests():
    print(proposeSgrnaFromGeneEdits([]))
    assert proposeSgrnaFromGeneEdits([]) == 'gatactactata'
    assert proposeSgrnaFromGeneEdits([])[3:6] == 'cat'

    
def predictEffectsOnMetabolimics():
    #given a change to genes
    #predict the change in the metabololome
    #https://en.wikipedia.org/wiki/METLIN
    #220,000 metabolite entries
    #50 million molecules per cell
    #70% cytoplasm
    #network of metabolic reactions
    #25% of weight in a cell = ribosome, 20,000

    #45 trillion cells per human
    #how many cells in an algae
    #50 million protein molecules in a cell
    #160,000 genes in algae
    #300,000 genes
    #simulate all combinations
    #see which give best biofuel
    return 10

def predictEffectsOnTranscriptome():
    #collection and properties of each ribosome+mrna
    return 'prediction.h5'
    
def predictProteinStructure(): #predicts effects of cell change on tissue
    return 'prediction.pdb'
    
CORS(app)
if __name__ == "__main__":

    app.run(debug=True)

from Bio import SeqIO
#protein updates involve which things in a cell - enzymes - especially for glowing and most of the things ?
#glowing plant = #just use a csv
# execAF = '''python3 docker/run_docker.py \
#   --fasta_paths=monomer.fasta \
#   --max_template_date=2021-11-01 \
#   --model_preset=monomer \
#   --data_dir=$DOWNLOAD_DIR \
#   --output_dir=/home/user/absolute_path_to_the_output_dir'''
# # Importing required module
# import subprocess
# # Using system() method to
# # execute shell commands
# subprocess.Popen(execAF, shell=True)
# def runAF():
#     run_relax = True  #@param {type:"boolean"}
#     relax_use_gpu = False  #@param {type:"boolean"}
#     multimer_model_max_num_recycles = 3  #@param {type:"integer"}
# # --- Run the model ---
#     if model_type_to_use == ModelType.MONOMER:
#     model_names = config.MODEL_PRESETS['monomer'] + ('model_2_ptm',)
#     elif model_type_to_use == ModelType.MULTIMER:
#     model_names = config.MODEL_PRESETS['multimer']
#     output_dir = 'prediction'
#     os.makedirs(output_dir, exist_ok=True)
#     plddts = {}
#     ranking_confidences = {}
#     pae_outputs = {}
#     unrelaxed_proteins = {}
#     for model_name in model_names:
#         cfg = config.model_config(model_name)
#         if model_type_to_use == ModelType.MONOMER: cfg.data.eval.num_ensemble = 1
#         elif model_type_to_use == ModelType.MULTIMER: cfg.model.num_ensemble_eval = 1

#         if model_type_to_use == ModelType.MULTIMER:
#             cfg.model.num_recycle = multimer_model_max_num_recycles
#             cfg.model.recycle_early_stop_tolerance = 0.5

#         params = data.get_model_haiku_params(model_name, './alphafold/data')
#         model_runner = model.RunModel(cfg, params)
#         processed_feature_dict = model_runner.process_features(np_example, random_seed=0)
#         prediction = model_runner.predict(processed_feature_dict, random_seed=random.randrange(sys.maxsize))

#         mean_plddt = prediction['plddt'].mean()

#         if model_type_to_use == ModelType.MONOMER:
#             if 'predicted_aligned_error' in prediction:
#                 pae_outputs[model_name] = (prediction['predicted_aligned_error'],
#                                             prediction['max_predicted_aligned_error'])
#             else:
#                 ranking_confidences[model_name] = prediction['ranking_confidence']
#                 plddts[model_name] = prediction['plddt']
#         elif model_type_to_use == ModelType.MULTIMER:
#             ranking_confidences[model_name] = prediction['ranking_confidence']
#             plddts[model_name] = prediction['plddt']
#             pae_outputs[model_name] = (prediction['predicted_aligned_error'],
#                                         prediction['max_predicted_aligned_error'])
#         final_atom_mask = prediction['structure_module']['final_atom_mask']
#         b_factors = prediction['plddt'][:, None] * final_atom_mask
#         unrelaxed_protein = protein.from_prediction(
#             processed_feature_dict,
#             prediction,
#             b_factors=b_factors,
#             remove_leading_feature_dimension=(
#                 model_type_to_use == ModelType.MONOMER))
#         unrelaxed_proteins[model_name] = unrelaxed_protein
#         del model_runner
#         del params
#         del prediction
#         best_model_name = max(ranking_confidences.keys(), key=lambda x: ranking_confidences[x])

#     if run_relax:
#         amber_relaxer = relax.AmberRelaxation(
#             max_iterations=0,
#             tolerance=2.39,
#             stiffness=10.0,
#             exclude_residues=[],
#             max_outer_iterations=3,
#             use_gpu=relax_use_gpu)
#         relaxed_pdb, _, _ = amber_relaxer.process(prot=unrelaxed_proteins[best_model_name])
#     else:
#         print('Warning: Running without the relaxation stage.')
#         relaxed_pdb = protein.to_pdb(unrelaxed_proteins[best_model_name])

#     # Construct multiclass b-factors to indicate confidence bands
#     # 0=very low, 1=low, 2=confident, 3=very high
#     banded_b_factors = []
#     for plddt in plddts[best_model_name]:
#         for idx, (min_val, max_val, _) in enumerate(PLDDT_BANDS):
#             if plddt >= min_val and plddt <= max_val: banded_b_factors.append(idx)
#             break
#     banded_b_factors = np.array(banded_b_factors)[:, None] * final_atom_mask
#     to_visualize_pdb = utils.overwrite_b_factors(relaxed_pdb, banded_b_factors)

#     pred_output_path = os.path.join(output_dir, 'selected_prediction.pdb')
#     with open(pred_output_path, 'w') as f: f.write(relaxed_pdb)
#     show_sidechains = True
#     print('done')
# # def plot_plddt_legend():
# #   """Plots the legend for pLDDT."""
# #   thresh = ['Very low (pLDDT < 50)',
# #             'Low (70 > pLDDT > 50)',
# #             'Confident (90 > pLDDT > 70)',
# #             'Very high (pLDDT > 90)']

# #   colors = [x[2] for x in PLDDT_BANDS]

# #   plt.figure(figsize=(2, 2))
# #   for c in colors:
# #     plt.bar(0, 0, color=c)
# #   plt.legend(thresh, frameon=False, loc='center', fontsize=20)
# #   plt.xticks([])
# #   plt.yticks([])
# #   ax = plt.gca()
# #   ax.spines['right'].set_visible(False)
# #   ax.spines['top'].set_visible(False)
# #   ax.spines['left'].set_visible(False)
# #   ax.spines['bottom'].set_visible(False)
# #   plt.title('Model Confidence', fontsize=20, pad=20)
# #   return plt

# # Show the structure coloured by chain if the multimer model has been used.
# if model_type_to_use == ModelType.MULTIMER:
#   multichain_view = py3Dmol.view(width=800, height=600)
#   multichain_view.addModelsAsFrames(to_visualize_pdb)
#   multichain_style = {'cartoon': {'colorscheme': 'chain'}}
#   multichain_view.setStyle({'model': -1}, multichain_style)
#   multichain_view.zoomTo()
#   multichain_view.show()

# # Color the structure by per-residue pLDDT
# color_map = {i: bands[2] for i, bands in enumerate(PLDDT_BANDS)}
# #view = py3Dmol.view(width=800, height=600)
# #view.addModelsAsFrames(to_visualize_pdb)
# style = {'cartoon': {'colorscheme': {'prop': 'b', 'map': color_map}}}
# if show_sidechains:
#   style['stick'] = {}
# #view.setStyle({'model': -1}, style)
# #view.zoomTo()

# grid = GridspecLayout(1, 2)
# out = Output()
# with out:
#   view.show()
# grid[0, 0] = out

# out = Output()
# with out:
#   plot_plddt_legend().show()
# grid[0, 1] = out

# #display.display(grid)

# # Display pLDDT and predicted aligned error (if output by the model).
# # if pae_outputs:
# #   num_plots = 2
# # else:
# #   num_plots = 1

# # plt.figure(figsize=[8 * num_plots, 6])
# # plt.subplot(1, num_plots, 1)
# # plt.plot(plddts[best_model_name])
# # plt.title('Predicted LDDT')
# # plt.xlabel('Residue')
# # plt.ylabel('pLDDT')

# # if num_plots == 2:
# #   plt.subplot(1, 2, 2)
# #   pae, max_pae = list(pae_outputs.values())[0]
# #   plt.imshow(pae, vmin=0., vmax=max_pae, cmap='Greens_r')
# #   plt.colorbar(fraction=0.046, pad=0.04)

# #   # Display lines at chain boundaries.
# #   best_unrelaxed_prot = unrelaxed_proteins[best_model_name]
# #   total_num_res = best_unrelaxed_prot.residue_index.shape[-1]
# #   chain_ids = best_unrelaxed_prot.chain_index
# #   for chain_boundary in np.nonzero(chain_ids[:-1] - chain_ids[1:]):
# #     if chain_boundary.size:
# #       plt.plot([0, total_num_res], [chain_boundary, chain_boundary], color='red')
# #       plt.plot([chain_boundary, chain_boundary], [0, total_num_res], color='red')

# #   plt.title('Predicted Aligned Error')
# #   plt.xlabel('Scored residue')
# #   plt.ylabel('Aligned residue')

# # Save the predicted aligned error (if it exists).
# pae_output_path = os.path.join(output_dir, 'predicted_aligned_error.json')
# if pae_outputs:
#   # Save predicted aligned error in the same format as the AF EMBL DB.
#   pae_data = confidence.pae_json(pae=pae, max_pae=max_pae.item())
#   with open(pae_output_path, 'w') as f:
#     f.write(pae_data)

# def difference(one, two):
#     return [item for item in one if item in two]

# def readFasta(filename):
#     return SeqIO.parse(open(filename),'fasta')

# def simulateMolecularDynamics():
#     system = forcefield.createSystem(pdb.topology, nonbondedMethod=CutoffNonPeriodic,
#     nonbondedCutoff=1*nanometer, constraints=None)
#     force = CustomExternalForce('100*max(0, r-2)^2; r=sqrt(x*x+y*y+z*z)')
#     system.addForce(force)
#     for i in range(system.getNumParticles()):
#         force.addParticle(i, [])
#     integrator = LangevinMiddleIntegrator(300*kelvin, 91/picosecond, 0.004*picoseconds)
#     import os
#     for file in os.listdir('structures'):
#         pdb = PDBFile(os.path.join('structures', file))
#         simulation.context.setPositions(pdb.positions)
#         state = simulation.context.getState(getEnergy=True)
#         print(file, state.getPotentialEnergy())

# def runSimulations(first, second):
#     result1 = simulateMolecularDynamics(first)
#     result2 = simulateMolecularDynamics(second)
#     return difference(result1, result2)

# def alphaFold():
#     return 123

# def applyEditToGenome(entireGenome, updatedGene):
#     return 

# def applyEditToGene(gene, before, edit):
#     idx = -1
#     for seq in gene:
#         idx+= 1
#         if before in seq:
#             break
#     return idx #gene.replace(before, edit)


# #how to propose a gene edit
# #use a prompt
# #use a menu
# #use a contentEditable textarea (nope)
# def edit_Gene_Get_New_Protein_And_Diff_TheResults(organism, gene, before, edit):
#     #dont need the proteins -> just use the genes ??
#     entireGenome = readFasta(organism) #200mb -> just a generator
#     geneToEdit = readFasta(gene)
#     protein_name = 'CpSRP54.fna'
#     first_protein = readFasta(protein_name) #read PDB or run AF
#     #sql.query('select prot from protein where gene_name = (?)', gene)
    
#     updatedGene = applyEditToGene(geneToEdit, before, edit)
#     updatedGenome = applyEditToGenome(entireGenome, geneToEdit, updatedGene) # display this

#     updatedProtein = runAF(updatedGene)
#     effects = runSimulations(first_protein, updatedProtein)

#     return jsonify([updatedProtein, updatedGenome, effects])

# #pypdb
# #flask_cors
# #https://www.tutorialspoint.com/biopython/biopython_overview_of_blast.htm
# #https://blast.ncbi.nlm.nih.gov/Blast.cgi?PAGE=Nucleotides&PROGRAM=blastn&QUERY=NC_003076.8&DATABASE=nr&MEGABLAST=on&BLAST_PROGRAMS=megaBlast&LINK_LOC=nuccore&PAGE_TYPE=BlastSearch&QUERY_FROM=1060106&QUERY_TO=1063425    
# #https://www.ncbi.nlm.nih.gov/datasets/taxonomy/3702/
# #https://api.ncbi.nlm.nih.gov/datasets/v2alpha/genome/download?filename=ncbi_dataset.zip&ncbi_phid=939B3D945261CB95000055F0642CA36E.1.m_1.021
# def fasta_dna_to_protein_file(filename):
#     seq_record = next(SeqIO.parse(open(filename),'fasta')) 
#     print('seq_record')

#     result_handle = NCBIWWW.qblast("blastn", "nt", seq_record.seq) 
#     print(result_handle) 

#     with open('results.xml', 'w') as save_file: 
#         blast_results = result_handle.read() 
#         save_file.write(blast_results)
# print('running fasta')
# fname = 'gene.fna'
# fasta_dna_to_protein_file(fname)
# print('exiting')
# exit()
# print('exitin 2g')

# knownInteractions = {}
# #go to the lab
# #given a protein on af
# #get gene
# #gene entire genome
# #perform sgrna substitution
# #simulate effects of gene on organism -> custom for each gene as of now 
# #simualate behavior of gene [done]
# # get pdb -> simulate behavior and interactions -> give readout of 
# # get pdb
# # get gene
# # replace gene in fasta using gene
# # get new protein ???
# # run alphafold on fasta to get new protein 
# # simulate new protein and previous protein and diff the behavior 
# # that gives you the results to tell user to see if it works
# # simulate as much shit as possible
# # http://plantcrispr.org/cgi-bin/crispr/index.cgi
# # find a fasta 
# # find selected gene - ideally list all genes that are possible to edit
# # find all possible ways to edit a genome using crispr
# # once gene is edited
# # get protein produced by gene

# #super easy to use and automated workflows and simulated experiments for algae people - correct
# #expediency = best 
# #compelte application today
# def getAllChemicalInteractions(fasta):
#     chemicalInteractions = []
#     for seq in fasta:
#         if (seq in knownInteractions):
#             chemicalInteractions.append(knownInteractions[seq])
#     return chemicalInteractions


# def get_db_connection():
#     conn = sqlite3.connect('database.db')
#     conn.row_factory = sqlite3.Row
#     return conn

# # @app.route('/gene-editing')
# # def lyrics():
# #     data = {}
# #     found_pdbs = pypdb.Query("algae").search()

# #     data['genesToEdit'] = {
# #         'name': 'go:123', 
# #         'effects': 'this adds glowing to a tree',
# #         'genesToEdit': found_pdbs
# #         }
# #     return jsonify(data)

# from flask import Flask, Response
# import time
# import json
# from openmm.app import *
# from openmm import *
# from openmm.unit import *
# #nnluz (luciferase), nnhisps (hispidin synthase), nnh3h (hispidin-3-hydroxylase), and nncph (caffeoyl pyruvate hydrolase)
# #https://www.pnas.org/doi/suppl/10.1073/pnas.1803615115
# #https://www.ncbi.nlm.nih.gov/pmc/articles/PMC7610436/
# first_glowing_genes_attempt = [
#     'nnluz',
#     'nnhisps', 
#     'nnh3h',
#     'nncph'
# ]
# #first
# def helloWorld():
#     print('Loading...')
#     #create custom PDB from fasta edit 
#     pdb = PDBFile('./data_sets/AF-A0A2W7I3V2-F1-model_v4.pdb')
#     forcefield = ForceField('amber99sb.xml', 'tip3p.xml')
#     modeller = Modeller(pdb.topology, pdb.positions)
#     print('Adding hydrogens...')
#     modeller.addHydrogens(forcefield)
#     print('Adding solvent...')
#     modeller.addSolvent(forcefield, model='tip3p', padding=1*nanometer)
#     print('Minimizing...')
#     system = forcefield.createSystem(modeller.topology, nonbondedMethod=PME)
#     integrator = VerletIntegrator(0.001*picoseconds)
#     simulation = Simulation(modeller.topology, system, integrator)
#     simulation.context.setPositions(modeller.positions)
#     simulation.minimizeEnergy(maxIterations=1)
#     print('Saving...')
#     positions = simulation.context.getState(getPositions=True).getPositions()
#     PDBFile.writeFile(simulation.topology, positions, open('output.pdb', 'w'))
#     print('Done', simulation.topology)
#     return simulation.topology

# app = Flask(__name__)
# @app.route('/gene-editing')
# def gene_editing():
#     workflow = req.params.seq

#     def simulate_and_stream():
#         content_length = 1e6
#         for i in range(10):
#             # Simulate some gene-editing computation here
#             time.sleep(1)
#             helloWorld()
#             # Generate JSON payload (could be the current state of the simulation)
#             simulation_data = {
#                 "iteration": i,
#                 "status": "in_progress",
#                 "data": [i, i + 1, i + 2]
#             }
            
#             payload = json.dumps(simulation_data)
#             payload_length = len(payload)
#             content_length += payload_length
            
#             yield payload

#         # Sending final state
#         simulation_data = {
#             "iteration": 10,
#             "status": "completed",
#             "data": []
#         }
#         yield json.dumps(simulation_data)
        
#     # Set the headers, including 'Content-Length' and 'Content-Type'
#     headers = {
#         'Content-Type': 'application/octet-stream',
#         'Transfer-Encoding': 'chunked',
#     }
#     return Response(simulate_and_stream(), headers=headers)
# #get list of viable edits online 
# def get_genome():
#     return ''
# def modelMolecularChanges(fasta, seq, index):
#     fasta[seq][index] = get_genome()
# def pdb_to_fasta(pdb):
#     assert 4 == 4
#     pass
# def fasta_to_pdb(fasta):
#     pass

# def editGenome(pdb, seq, index):
#     fasta = pdb_to_fasta(pdb)
#     fasta = modelMolecularChanges(fasta, seq, index)
#     pdb = fasta_to_pdb(fasta)
#     return pdb
# @app.route('/alignment-editing')
# def seeHowDNAEditsChangeThealignmentsOfTheGenome():
#     seq = req.params.seq
#     index = req.params.index
#     data = {
#         'alignment': 'gataccat',
#         'index': index,
#         'seq': seq
#     }
#     runGenomeSequencingAlgorithm(data)
#     return data
# def runGenomeSequencingAlgorithm(data):
#     seq = data['seq']
#     l = len(seq)
#     for i in range(l):
#         for j in range(l):
#             seq[i] = seq[j]
#     return data
# #edit genome -> see how the updated 3d structure affects how it changes how it runs within the cell
# #what other types of agents are there in a cell
# #mitochrondria, ribosomes, sgRNA 
# #hardcode nucleus
# Organelle_Types = [
#     'ribosome', 'mitochondria', ''
# ]
# #use an octree for spatial acceleration lookups
# #use numpy for faster vector math
# #simulate 5 different systems in cell
# #using machine learning to initialize the state of a cell so that it matches various states captured in single cell analysis 
# #about 100 studies -> 5000-100,000 cell states in each one
# #match the tissue and cell type
# 	#1500 ribosomes
# 	#70% cytoplasm
# 	#represent as 1 million agents = organelles and have them collide and interact with each other 
# 	#each collision may change the state of each agent 
# #simulate experiments so that biologists dont have to run as many
# #export procedures for robots and humans to exectute in the lab
# class Organelle:
#     def __init__(self, coords=[0,0,0], dir=[0,0,0]):
#         self.coords = [0,0,0]
#         self.dir = [0,0,0]
#         self.type = 0
#         #what states are there in an organelle 
#     def step():
#         self.coords[0] = self.coords[0] + self.dir[0]
#         self.coords[1] = self.coords[1] + self.dir[1]
#         self.coords[2] = self.coords[2] + self.dir[2]
#     def interaction ():
#         if collison(self.pos, self.neighbors):
#             self.dir[0]
# import random
# def simulateCellChanges():
#     agents = []

#     for i in range(1e6):
#         type = i % 5
#         agents.append(Organelle(type, [i % 2, i % 3, i% 4], [i % 2, i% 2, i% 3])
#         )
#     iterations = 0
#     while (iterations < 5000):
#         iterations += 1
#         for agent in agents: agent.step() 
# class ExperimentModel:
#     def __init__(self):
#         self.steps = []
#         self.parameters = None
#     def step(self):
#         return 1
# def simulateExperiments(parameters):
#     model = ExperimentModel()
#     model.parameters = parameters 
#     model.step()
# #https://www.frontiersin.org/articles/10.3389/fchem.2023.1106495/full
# @route('/proteinomics')
# def solveProblem():
#     fasta = req.params.fasta
#     import alphaFold
#     alphaFold.run('./fasta')
#     return 
# def solveTheProblem():
#     #go in person to every lab in the nation and talk to every biologist and find out software they use and come up with new workflows that they couldnt do before with new tools that they didnt have before 
#     #   for each biologist(blueBiotech/greenBiotech) in the nation:
#             # talk to each one in person
#             #get a list of problems
#             #get a list of things they do
#             #find a new way of doing specific tasks they have
#             #convert each problem into a list of requirements 
#             #convert each list of requirements into a list of tasks
#             #solve each task one by one
#             #return working product
#             #return to step 1
#     return 1
# def findWalgreens():
#     data = request('http://api.yelp.com/?&longitude=${longtiude}&latitude=${latitude}')
#     print(data)     
# #edit the PDB directly according to what the fasta file says 
# #me = {} -> send request to nameServer which dispatches a route from cvs to postoffice

def checkoutCart(params):
    stripe_modal()
    sendToLab()
    return emails

#to do great work you have to not be distracted
#they dont care they want you to do it anyway
#hold 20 items in working memory and write perfect code w/o any mistakes 
