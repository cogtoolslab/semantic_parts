from __future__ import division
import os
import urllib, cStringIO
import pymongo as pm ## first establish ssh tunnel to server where database is running
import base64
import numpy as np
from numpy import *
import PIL
from PIL import Image
import base64
import matplotlib
from matplotlib import pylab, mlab, pyplot
from IPython.core.pylabtools import figsize, getfigs
plt = pyplot
import seaborn as sns
sns.set_context('poster')
sns.set_style('white')
from matplotlib.path import Path
import matplotlib.patches as patches
import pandas as pd
from svgpathtools import parse_path, wsvg
from glob import glob
from IPython.display import clear_output


def list_files(path, ext='png'):
    result = [y for x in os.walk(path) for y in glob(os.path.join(x[0], '*.%s' % ext))]
    return result

def flatten(x):
    return [val for sublist in x for val in sublist]

def make_svg_list(stroke_recs):
    '''
    grab sample drawing's strokes and make a list of svg strings from it
    '''
    svg_list = []
    for single_stroke in stroke_recs:
        svg_string = single_stroke['svgData']
        svg_list.append(svg_string)
    return svg_list

def render_svg(paths,
               stroke_width = 5,
               stroke_linecap = 'round',
               stroke_color = 'black',
               fill_mode = 'none',
               viewbox=[0, 0, 300, 300],
               base_dir = './',
               out_dir = 'svg',
               out_fname= 'tmp.svg'):

    '''
    see docs for wsvg: https://www.pydoc.io/pypi/svgpathtools-1.3.3/autoapi/paths2svg/index.html?highlight=wsvg#paths2svg.wsvg
    wsvg(paths=None, colors=None, filename=join, stroke_widths=None, nodes=None, node_colors=None, node_radii=None, openinbrowser=False, timestamp=False, margin_size=0.1, mindim=600, dimensions=None, viewbox=None, text=None, text_path=None, font_size=None, attributes=None, svg_attributes=None)
    '''

    ## render out to svg file
    #print('Rendering out to {}'.format(os.path.join(out_dir,out_fname)))
    if not os.path.exists(out_dir):
        os.makedirs(out_dir)
    wsvg(paths,
         attributes=[{'stroke-width':stroke_width,\
                      'stroke-linecap':stroke_linecap,\
                      'stroke':stroke_color,\
                      'fill':fill_mode}]*len(paths),
         viewbox=viewbox,
         filename=os.path.join(base_dir,out_dir,out_fname))

def generate_svg_path_list(svg_dir):
    svg_paths = list_files(svg_dir, ext='svg')
    svg_paths = [i for i in svg_paths if i != '.DS_Store']
    return svg_paths

def svg_to_png(svg_paths,
               base_dir = './',
               out_dir = 'png'):
    '''
    svg_paths: list of paths to svg files
    '''
    if not os.path.exists(os.path.join(base_dir,out_dir)):
        os.makedirs(os.path.join(base_dir,out_dir))
    for path in svg_paths:
        out_path = os.path.join(base_dir,out_dir,'{}.png'.format(path.split('/')[-1].split('.')[0]))
        ## running ImageMagick command 'convert' to convert svgs to pngs
        cmd_string = 'convert {} {}'.format(path,out_path)
        print(cmd_string)
        os.system(cmd_string)
        clear_output(wait=True)



# ######## below functions are deprecated, remove when safe ########
# def polysegment_pathmaker(segment):
#     x = []
#     y = []
#     codes = []
#     for i,pair in enumerate(segment):
#         if pair[0] == "curve":
#             for _i,_l in enumerate(pair[1]):
#                 x.append(_l[0])
#                 y.append(_l[1])
#                 if _i%4==0:
#                     codes.append(Path.MOVETO)
#                 else:
#                     codes.append(Path.CURVE4) # remaining control and endpoints for each spline
#         else:
#             for _i, _l in enumerate(pair[1]):
#                 x.append(_l[0])
#                 y.append(_l[1])
#                 if _i == 0:
#                     codes.append(Path.MOVETO)
#                 elif _i < len(pair[1]) - 1:
#                     codes.append(Path.LINETO)  # keep pen on page
#                 else:
#                     if _i != len(segment) - 1:  # final vertex
#                         codes.append(Path.MOVETO)
#     verts = zip(x, y)
#     return verts, codes

# def path_renderer(verts, codes):
#     fig = plt.figure(figsize=(6,6))
#     ax = fig.add_subplot(111)
#     if len(verts)>0:
#         path = Path(verts, codes)
#         patch = patches.PathPatch(path, facecolor='none', edgecolor='black',lw=2)
#         ax.add_patch(patch)
#         ax.set_xlim(0,500)
#         ax.set_ylim(0,500)
#         ax.axis('off')
#         plt.gca().invert_yaxis() # y values increase as you go down in image
#         plt.show()
#     else:
#         ax.set_xlim(0,500)
#         ax.set_ylim(0,500)
#         ax.axis('off')
#         plt.show()
# #     plt.savefig('./')
#     plt.close()

# def get_verts_and_codes(svg_list):
#     segment = []
#     Verts = []
#     Codes = []
#     for stroke_ind,stroke in enumerate(svg_list):
#         #print "stroke number {}".format(stroke_ind)
#         x = []
#         y = []
#         parsed = parse_path(stroke)
#         for i, p in enumerate(parsed):
#             if len(p) == 4:
#                 x.append(p.start.real)
#                 y.append(p.start.imag)
#                 x.append(p.control1.real)
#                 y.append(p.control1.imag)
#                 x.append(p.control2.real)
#                 y.append(p.control2.imag)
#                 x.append(p.end.real)
#                 y.append(p.end.imag)
#                 segment.append(["curve", zip(x,y)])
#             else:
#                 assert len(p) == 2

#                 if i != len(parsed) - 1:  # last line segment
#                     if (p.start.real != p.end.real or p.start.imag != p.end.imag):
#                         x.append(p.start.real)
#                         y.append(p.start.imag)
#                 else:
#                     x.append(p.start.real)
#                     print p.start.real
#                     y.append(p.start.imag)
#                     print p.start.imag
#                     x.append(p.end.real)
#                     print p.end.real
#                     y.append(p.end.imag)
#                     print p.end.imag
#                 segment.append(["line", zip(x,y)])
#         verts, codes = polysegment_pathmaker(segment)
#         Verts.append(verts)
#         Codes.append(codes)
#     return Verts, Codes

# def render_and_save(Verts,
#                     Codes,
#                     line_width=5,
#                     imsize=8,
#                     canvas_size=600,
#                     game_id='GAME_ID',
#                     trial_num='TRIAL_NUM',
#                     category='CATEGORY'):

#     '''
#     input:
#         line_width: how wide of strokes do we want? (int)
#         imsize: how big of a picture do we want? (setting the size of the figure)
#         canvas_size: original canvas size on tablet?
#         out_path: where do you want to save your images? currently hardcoded below.
#     output:
#         rendered sketches into nested directories

#     '''
#     ## where do you want to save your cumulative drawings?
#     out_path = os.path.join('./cumulative_drawings','{}'.format(game_id),'{}_{}'.format(trial_num,category))
#     if not os.path.exists('./cumulative_drawings'):
#         os.makedirs('./cumulative_drawings')
#     if not os.path.exists(os.path.join('cumulative_drawings','{}'.format(game_id))):
#         os.makedirs(os.path.join('cumulative_drawings','{}'.format(game_id)))

#     verts = Verts[0]
#     codes = Codes[0]
#     for i,verts in enumerate(Verts):
#         codes = Codes[i]
#         fig = plt.figure(figsize=(imsize,imsize))
#         ax = plt.subplot(111)
#         ax.axis('off')
#         ax.set_xlim(0,canvas_size)
#         ax.set_ylim(0,canvas_size)
#         ### render sketch so far
#         if len(verts)>0:
#             path = Path(verts, codes)
#             patch = patches.PathPatch(path, facecolor='none', lw=line_width)
#             ax.add_patch(patch)
#             plt.gca().invert_yaxis() # y values increase as you go down in image
# #             plt.show()


#         ## save out as png
#         ## maybe to make it not render every single thing, use plt.ioff
#         if not os.path.exists(out_path):
#             os.makedirs(out_path)
#         fname = '{}_{}_{}_{}.png'.format(game_id,trial_num,category,i)
#         filepath = os.path.join(out_path,fname)
#         print filepath
#         fig.savefig(filepath,bbox_inches='tight')
#         plt.close(fig)
