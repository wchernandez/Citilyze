/**
 * Municipal Data API - Handles communication with Socrata (NYC) and ArcGIS (Auckland) REST feeds.
 */

import { CityData, MunicipalAlert, MapRisk } from '../types';
export type { CityData, MunicipalAlert, MapRisk };

export const fetchNYCData = async (): Promise<CityData | null> => {
    try {
        const res = await fetch('https://data.cityofnewyork.us/resource/erm2-nwe9.json?$limit=800&$order=created_date DESC');
        const data = await res.json();
        if (!Array.isArray(data)) return null;

        const total = data.length;
        const open = data.filter((d: any) => d.status === 'Open' || d.status === 'In Progress').length;
        const stabilityVal = total > 0 ? Math.round(((total - open) / total) * 100) : 100;

        const serious = data.filter((d: any) =>
            ['Street Condition', 'Illegal Parking', 'Noise', 'Water System'].includes(d.complaint_type)
        ).length;
        const integrityVal = Math.round(Math.max(30, 100 - (serious / total) * 100));

        const mapRisks = data.filter((d: any) => d.latitude && d.longitude).slice(0, 400).map((d: any) => ({
            id: d.unique_key,
            lat: parseFloat(d.latitude),
            lng: parseFloat(d.longitude),
            location: d.incident_address || d.street_name || 'NYC Node',
            category: d.complaint_type || 'Civil Item',
            score: d.status === 'Open' ? 100 : 40
        }));

        const mappedCounts: Record<string, number> = {};
        data.forEach((d: any) => {
            const fullType = d.complaint_type || 'Other';
            const short = fullType.split(' ')[0].replace(/[^a-zA-Z]/g, '');
            mappedCounts[short] = (mappedCounts[short] || 0) + 1;
        });

        const sentimentData = Object.entries(mappedCounts)
            .sort((a, b) => b[1] - a[1])
            .slice(0, 8)
            .map(([k, v], i) => ({
                name: k,
                uv: v,
                fill: ['#8b5cf6', '#ef4444', '#f59e0b', '#10b981', '#3b82f6', '#f59e0b', '#8b5cf6', '#10b981'][i % 8]
            }));

        const zipCounts: Record<string, number> = {};
        data.forEach((d: any) => {
            if (d.incident_zip) {
                zipCounts[d.incident_zip] = (zipCounts[d.incident_zip] || 0) + 1;
            }
        });

        const varianceData = Object.entries(zipCounts)
            .sort((a, b) => b[1] - a[1])
            .slice(0, 9)
            .map(([zip, count], i) => ({
                name: `Zip ${zip}`,
                val: count,
                fill: i % 2 === 0 ? '#3b82f6' : '#14b8a6'
            }));

        const alerts = data.slice(0, 50).map((d: any, i: number) => ({
            id: d.unique_key || i,
            level: ['Street Condition', 'Illegal Parking', 'Noise'].includes(d.complaint_type) ? ('high' as const) : ('medium' as const),
            message: `${d.complaint_type} at ${d.incident_address || 'NYC'}`,
            description: d.descriptor || 'No additional details available.',
            agency: d.agency_name || d.agency || 'NYC Municipal',
            status: d.status || 'Active',
            created: d.created_date
        }));

        return {
            totalComplaints: total,
            pendingComplaints: open,
            stabilityVal,
            integrityVal,
            seriousCount: serious,
            mapRisks,
            sentimentData,
            varianceData,
            alerts
        };
    } catch (e) {
        console.error('NYC Data Fetch Error:', e);
        return null;
    }
};

export const fetchAucklandData = async (): Promise<CityData | null> => {
    try {
        const res = await fetch('https://services2.arcgis.com/JkPEgZJGxhSjYOo0/arcgis/rest/services/Roadworks/FeatureServer/0/query?where=1%3D1&outFields=*&outSR=4326&f=json&resultRecordCount=200');
        const json = await res.json();
        const features = json.features || [];

        const total = features.length;
        const open = features.filter((f: any) => f.attributes.Status !== 'Completed').length;
        const stabilityVal = total > 0 ? Math.round(((total - open) / total) * 100 + 20) : 80;

        const serious = features.filter((f: any) => f.attributes.WorksiteType === 'Excavation').length;
        const integrityVal = Math.round(Math.max(40, 100 - (serious / total) * 100));

        const mapRisks = features.map((f: any) => ({
            id: f.attributes.OBJECTID,
            lat: f.geometry.y,
            lng: f.geometry.x,
            location: f.attributes.WorksiteName || f.attributes.ProjectName || 'Auckland Roadwork',
            category: f.attributes.WorksiteType || 'Infrastructure',
            score: f.attributes.Status === 'Completed' ? 40 : 100
        }));

        const aStats: Record<string, number> = {};
        features.forEach((f: any) => {
            const t = f.attributes.WorksiteType || 'Minor';
            aStats[t] = (aStats[t] || 0) + 1;
        });

        const sentimentData = Object.entries(aStats)
            .sort((a, b) => b[1] - a[1])
            .slice(0, 8)
            .map(([k, v], i) => ({
                name: k.toString().substring(0, 12),
                uv: v,
                fill: ['#8b5cf6', '#ef4444', '#f59e0b', '#10b981', '#3b82f6', '#f59e0b', '#8b5cf6', '#10b981'][i % 8]
            }));

        const varianceData = Object.entries(aStats).slice(0, 9).map(([k, v], i) => ({
            name: k.toString().substring(0, 10),
            val: v + (Math.random() * 5),
            fill: i % 2 === 0 ? '#0ea5e9' : '#14b8a6'
        }));

        const alerts = features.slice(0, 50).map((f: any) => ({
            id: f.attributes.OBJECTID,
            level: f.attributes.WorksiteType === 'Excavation' ? ('high' as const) : ('medium' as const),
            message: `${f.attributes.WorksiteType}: ${f.attributes.WorksiteName || 'Infrastructure project'}`,
            description: f.attributes.ProjectDescription || f.attributes.LocationDescription || 'Regional infrastructure project.',
            agency: 'Auckland Transport',
            status: f.attributes.Status || 'Active',
            created: f.attributes.StartDate ? new Date(f.attributes.StartDate).toISOString() : new Date().toISOString()
        }));

        return {
            totalComplaints: total,
            pendingComplaints: open,
            stabilityVal,
            integrityVal,
            seriousCount: serious,
            mapRisks,
            sentimentData,
            varianceData,
            alerts
        };
    } catch (e) {
        console.error('Auckland Data Fetch Error:', e);
        return null;
    }
};
