import os
import numpy as np
import seaborn as sns
import pandas as pd


## this is where we will place analysis helper functions

def convert_numeric(X,column_id):
    ## make numeric types for aggregation
    X[column_id] = pd.to_numeric(X[column_id])
    return X


def remove_nans(x):
    nan_inds = np.isnan(x)
    _x = x[nan_inds==False]
    return _x
    