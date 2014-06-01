import csv

import click
import requests


@click.command()
@click.argument('filepath')
@click.argument('category')
def csv_upload(filepath, category):
    """upload data from csv file"""
    with open(filepath, 'rb') as f:
        reader = csv.DictReader(f)
        for row in reader:
            post_row(row, category)


def post_row(row, category):
    endpoint = '/api/v1/project'

    parameters = [
        'name',
        'category_name'
        'description',
        'location',
        'zipcodeId',
        'volunteer',
        'images',
        'annualYield',
        'projectCoordinator',
        'volunteering',
        'memberships',
        'products',
        'education',
        'longitude',
        'latitude'
    ]

    data = {}

    for parameter in parameters:
        if parameter in row:
            data[parameter] = row[parameter]
            requests.post(endpoint, data=data)


if __name__ == '__main__':
    csv_upload()
