from typing import Union

from fastapi import FastAPI

import pickle

from fastapi.middleware.cors import CORSMiddleware

origins = [
    "http://localhost",
    "http://localhost:4200",
]

movies = pickle.load(open('formated_movies_data.plk', 'rb'))
model = pickle.load(open('similarity.plk', 'rb'))

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/movies/{title}")
def read_item(title: str, q: Union[str, None] = None):
    movie_index = movies[movies['title'] == title].index[0]
    distance = sorted(
        list(enumerate(model[movie_index])), reverse=True, key=lambda vector: vector[1])
    recommendations = []

    for i in distance[0:10]:
        recommendations.append(movies.iloc[i[0]].title)
    return {"data": recommendations}
