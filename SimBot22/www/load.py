import gensim
import logging
import nltk
import sys
from nltk import pos_tag
from textblob import TextBlob
from nltk.corpus import wordnet
from gensim.models.keyedvectors import KeyedVectors

logging.basicConfig(format='%(asctime)s : %(levelname)s : %(message)s', level=logging.INFO)
model = gensim.models.word2vec.Word2Vec.load("wiki.en.text.model")
# print(model.most_similar("boy"))

location = ["park","supermarket","pool","library","school"]
synonyms=[]

# sentences = input("please input English : ")
sentences = sys.argv[1]
words=nltk.word_tokenize( sentences)
pos_tags =nltk.pos_tag(words)
# print(pos_tags)

for i in range(len(pos_tags)):
    if pos_tags[i][1]=="NN" or pos_tags[i][1]=="NNS" or pos_tags[i][1]=="VB" or pos_tags[i][1]=="RB" :
        # print(pos_tags[i][0])
        for a in range(len(location)):
            y1 = model.wv.similarity(location[a], pos_tags[i][0])
            # print(location[a]+"和"+pos_tags[i][0]+"的關係度為：", y1)
            synonyms.append([y1,location[a]])
synonyms.sort(reverse = True)
# print(synonyms)
print(synonyms[0][1])

# while True:
#     str = input("请输入：");
#     print ("你输入的内容是: ", str)
#     str2 = ['school', 'library', 'pool', 'park', 'supermarket']
#     for i in range(len(str2)):
#         y1 = model.similarity(str, str2[i])
#         print(str2[i] + "與" + str + y1)
