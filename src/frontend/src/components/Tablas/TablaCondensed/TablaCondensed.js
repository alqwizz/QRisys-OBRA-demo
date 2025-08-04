import React from 'react';

export function TablaCondensed({ head, body }) {
    return (
        <div className="table-responsive">
            <div id="basicTable_wrapper" className="dataTables_wrapper form-inline no-footer">
                <table className="table table-condensed table-detailed dataTable no-footer" id="detailedTable" role="grid">
                    <thead>
                        {head}
                    </thead>
                    <tbody>
                        {body}
                    </tbody>
                </table >
            </div>
        </div>)
}
