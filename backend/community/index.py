import json
import os
import psycopg2
from psycopg2.extras import RealDictCursor
from typing import Dict, Any

def handler(event: Dict[str, Any], context: Any) -> Dict[str, Any]:
    '''
    Business: Get community projects from database
    Args: event - dict with httpMethod, queryStringParameters
          context - object with request_id attribute
    Returns: HTTP response dict with projects list
    '''
    method: str = event.get('httpMethod', 'GET')
    
    if method == 'OPTIONS':
        return {
            'statusCode': 200,
            'headers': {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'GET, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type',
                'Access-Control-Max-Age': '86400'
            },
            'body': '',
            'isBase64Encoded': False
        }
    
    if method != 'GET':
        return {
            'statusCode': 405,
            'headers': {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            },
            'body': json.dumps({'error': 'Method not allowed'}),
            'isBase64Encoded': False
        }
    
    database_url = os.environ.get('DATABASE_URL')
    
    conn = psycopg2.connect(database_url)
    cursor = conn.cursor(cursor_factory=RealDictCursor)
    
    cursor.execute(
        "SELECT id, title, author_name, author_avatar, thumbnail, likes, views, created_at FROM community_projects ORDER BY created_at DESC"
    )
    projects = cursor.fetchall()
    
    cursor.close()
    conn.close()
    
    projects_list = []
    for project in projects:
        projects_list.append({
            'id': project['id'],
            'title': project['title'],
            'authorName': project['author_name'],
            'authorAvatar': project['author_avatar'],
            'thumbnail': project['thumbnail'],
            'likes': project['likes'],
            'views': project['views'],
            'createdAt': project['created_at'].isoformat() if project['created_at'] else None
        })
    
    return {
        'statusCode': 200,
        'headers': {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*'
        },
        'body': json.dumps({'projects': projects_list}),
        'isBase64Encoded': False
    }
