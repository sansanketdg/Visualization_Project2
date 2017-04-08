import pandas as pd
import random as rd
from sklearn.decomposition import PCA
from sklearn.cluster import KMeans
from sklearn import metrics
from sklearn.manifold import MDS
import numpy as np
from sklearn import cluster as Kcluster
from sklearn.preprocessing import StandardScaler, MinMaxScaler
from flask import Flask, render_template

def elbowKMeans(inputData, n):
    Ks = list(range(1, n))
    km = [KMeans(n_clusters=i) for i in Ks]
    score = [km[i].fit(inputData).score(inputData) for i in range(len(km))]
    df_Ks = pd.DataFrame(Ks)
    df_Ks.columns = ["K"]
    df_score = pd.DataFrame(score).abs()
    df_score.columns = ["k_means_score"]
    sample = df_Ks.join([df_score])
    sample.to_csv("./static/data/elbow.csv", sep=',')
    return 1

def stratified_sampling(data_frame, cluster_count, fraction):
    k_means = Kcluster.KMeans(n_clusters=cluster_count)
    k_means.fit(data_frame)

    data_frame['label'] = k_means.labels_

    sample_label = []
    for i in range(cluster_count):
        sample_label.append(data_frame[data_frame['label'] == i].index);

    sample_Idx = []
    for i in range(cluster_count):
        sample_Idx.extend(rd.sample(list(sample_label[i]), (int)(fraction*(len(sample_label[i])))))

    data_frame.drop('label', axis=1, inplace=True)
    stratifiedSampleRows = []
    for i in sample_Idx:
        stratifiedSampleRows.append(data_frame.ix[i])

    return pd.DataFrame(stratifiedSampleRows)

def analyse_pca(random_sample, stratified_sample):
    random_std_samples = StandardScaler().fit_transform(random_sample)
    stratified_std_samples = StandardScaler().fit_transform(stratified_sample)
    pca = PCA(n_components=2)
    pca_random = pd.DataFrame(pca.fit_transform(random_std_samples))
    pca_stratified = pd.DataFrame(pca.fit_transform(stratified_std_samples))
    createFile(pca_random, pca_stratified, "pca_output.csv")

def createScreeWithEigan(inputSamples, filename):
    X_std = StandardScaler().fit_transform(inputSamples)
    # Eigan values for co-relation matrix
    cor_mat1 = np.corrcoef(X_std.T)
    eig_vals, eig_vecs = np.linalg.eig(cor_mat1)
    y = eig_vals
    x = np.arange(len(y)) + 1
    df_eig = pd.DataFrame(eig_vals)
    df_eig.columns = ["eigan_values"]
    df_pca = pd.DataFrame(x)
    df_pca.columns = ["PCA_components"]
    sample = df_eig.join([df_pca])
    sample.to_csv("./static/data/" + filename, sep=',')

data_directory = "./static/data/"
def createFile(pca_random, pca_stratified, file_name):
    pca_random.columns = ["r1", "r2"]
    pca_stratified.columns = ["s1", "s2"]
    sample = pca_random.join([pca_stratified])
    file_name = data_directory + file_name
    sample.to_csv(file_name, sep=',')

def find_MDS(dataframe, type):
    dis_mat = metrics.pairwise_distances(dataframe, metric=type)
    mds = MDS(n_components=2, dissimilarity='precomputed')
    return pd.DataFrame(mds.fit_transform(dis_mat))

def get_squared_loadings(dataframe, intrinsic, filename):
    std_input = StandardScaler().fit_transform(dataframe)
    pca = PCA(n_components=intrinsic)
    pca.fit_transform(std_input)

    # get the loadings here
    loadings = pca.components_
    squared_loadings = []
    a = np.array(loadings)
    a = a.transpose()

    # find sqaured loadings
    for i in range(len(a)):
        squared_loadings.append(np.sum(np.square(a[i])))

    # save squared_loadings in csv
    df_attributes = pd.DataFrame(pd.DataFrame(dataframe).columns)
    df_attributes.columns = ["attributes"]
    df_sqL = pd.DataFrame(squared_loadings)
    df_sqL.columns = ["squared_loadings"]
    sample = df_attributes.join([df_sqL])
    sample = sample.sort_values(["squared_loadings"], ascending=[False])
    sample.to_csv("./static/data/" + filename, sep=',')
    return sample

def getTop3attributes(squared_loadings):
    top3 = squared_loadings.head(n = 3)
    return top3['attributes'].values.tolist()

def main():
    ## MAIN CODE STARTS HERE

    # Here we will take 10% samples randomly from input set
    inputData = pd.read_csv('my_dengue.csv')
    random_samples = inputData.sample(frac=0.3)

    # Here we will take total 10% samples from each k clusters found from elbow method
    elbowKMeans(inputData, 10)

    # As per the plot we see optimal k
    optimalK = 3

    # Now we will do
    stratified_samples = stratified_sampling(inputData, optimalK, 0.3)

    # pca analysis
    analyse_pca(random_samples, stratified_samples)

    # createSpreePlot(stratified_samples)
    createScreeWithEigan(random_samples, "scree_plot_random.csv")
    createScreeWithEigan(stratified_samples, "scree_plot_stratified.csv")

    # intrinsic dimentionality
    intrinsic = 4

    # get squared loadings
    squared_loadings_random = get_squared_loadings(random_samples, intrinsic, "squared_loadings_random.csv")
    squared_loadings_stratified = get_squared_loadings(stratified_samples, intrinsic, "squared_loadings_stratified.csv")

    # find top 3 attributes with highest PCA loadings
    top3attributes_random = getTop3attributes(squared_loadings_random)
    top3attributes_stratified = getTop3attributes(squared_loadings_stratified)

    mms = MinMaxScaler()
    nps = mms.fit_transform(random_samples.ix[:, top3attributes_random])
    dengue_data_n = pd.DataFrame(nps)

    dengue_data_n.columns = [top3attributes_random[0], top3attributes_random[1], top3attributes_random[2]]
    dengue_data_n.to_csv("./static/data/scatterplot_matrix_random.csv", sep=',', index=False)

    mms = MinMaxScaler()
    nps = mms.fit_transform(stratified_samples.ix[:, top3attributes_stratified])
    dengue_data_n = pd.DataFrame(nps)

    dengue_data_n.columns = [top3attributes_stratified[0], top3attributes_stratified[1], top3attributes_stratified[2]]
    dengue_data_n.to_csv("./static/data/scatterplot_matrix_stratified.csv", sep=',', index=False)

    # get data via mds(euclidian, correlation)
    mds_types = ["euclidean", "correlation"]
    for type_mds in mds_types:
        createFile(find_MDS(random_samples, type_mds), find_MDS(stratified_samples, type_mds), type_mds + ".csv")

app = Flask(__name__);

@app.route('/')
def home():
    return render_template('index.html')

if __name__ == '__main__':
    main()
    app.run()